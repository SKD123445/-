import { useEffect, useMemo, useRef, useState } from 'react'
import './DepthText.css'

const MAX_LAYERS = 64
const INTRO_MS = 1200
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const mixLayerColor = (faceColor, depthColor, index, total) => {
  const progress = total <= 1 ? 1 : index / total
  const eased = progress * progress
  const faceMix = Math.round((1 - eased) * 72 + 4)
  return `color-mix(in srgb, color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor}) 92%, black)`
}

const buildTransform = (rotateX, rotateY, sink = 0) =>
  `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)${sink ? ` translateZ(${(-sink).toFixed(2)}px)` : ''}`

export default function DepthText({
  text,
  layers = 24,
  depth = 1,
  faceColor = 'currentColor',
  depthColor = '#7c3aed',
  tilt = 5,
  pointerTracking = true,
  smoothing = 0.14,
  perspective = 900,
  autoOrbit = true,
  orbitSpeed = 0.12,
  hoverPush = 0.2,
  fontSize = 'inherit',
  fontWeight = 800,
  shadow = true,
  intro = true,
  className = '',
  style = {},
}) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const introRef = useRef(intro ? 0 : 1)
  const [introDone, setIntroDone] = useState(!intro)
  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS)
  const safeDepth = clamp(Number(depth) || 0, 0, 12)
  const safeTilt = clamp(Number(tilt) || 0, 0, 12)
  const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35)
  const extent = safeLayers * safeDepth
  const baseRotation = useMemo(() => ({ x: -safeTilt * 0.26, y: safeTilt * 0.34 }), [safeTilt])

  const depthLayers = useMemo(() => (
    Array.from({ length: safeLayers }, (_, layerIndex) => {
      const index = safeLayers - layerIndex
      return {
        index,
        color: mixLayerColor(faceColor, depthColor, index, safeLayers),
        transform: `translateZ(calc(var(--depth-text-grow, 1) * ${(-index * safeDepth).toFixed(2)}px))`,
      }
    })
  ), [safeLayers, safeDepth, faceColor, depthColor])

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const canTrack = pointerTracking && finePointer && !reducedMotion
    let frameId = 0
    let lastTime = 0
    let activePointer = false
    let hovered = false
    let visible = true
    const startTime = performance.now()
    const current = { ...baseRotation }
    const target = { ...baseRotation }

    const applyGrow = () => {
      const progress = introRef.current
      const grow = progress >= 1 ? 1 : 1 - Math.pow(1 - progress, 3)
      const push = hovered ? hoverPush : 0
      stage.style.setProperty('--depth-text-grow', Math.max(0.15, grow * (1 - push)).toFixed(4))
    }

    const tick = now => {
      const delta = lastTime ? Math.min(now - lastTime, 50) : 16
      lastTime = now
      if (introRef.current < 1) {
        introRef.current = Math.min(1, introRef.current + delta / INTRO_MS)
        if (introRef.current >= 1) setIntroDone(true)
      }
      if ((!canTrack || !activePointer) && autoOrbit) {
        const angle = ((now - startTime) / 1000) * orbitSpeed * Math.PI * 2
        target.x = baseRotation.x + Math.sin(angle) * safeTilt * 0.18
        target.y = baseRotation.y + Math.cos(angle * 0.85) * safeTilt * 0.18
      }
      current.x += (target.x - current.x) * safeSmoothing
      current.y += (target.y - current.y) * safeSmoothing
      stage.style.transform = buildTransform(current.x, current.y, hovered ? extent * hoverPush : 0)
      applyGrow()
      if (visible) frameId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!frameId && visible) frameId = requestAnimationFrame(tick)
    }
    const onMove = event => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      activePointer = true
      const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1)
      const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1)
      target.x = baseRotation.x - y * safeTilt
      target.y = baseRotation.y + x * safeTilt
      start()
    }
    const onPointerOut = event => {
      if (event.relatedTarget) return
      activePointer = false
      target.x = baseRotation.x
      target.y = baseRotation.y
    }
    const onEnter = () => { hovered = true; start() }
    const onLeave = () => { hovered = false; start() }

    if (reducedMotion) {
      introRef.current = 1
      stage.style.setProperty('--depth-text-grow', '1')
      stage.style.transform = buildTransform(baseRotation.x, baseRotation.y)
      setIntroDone(true)
      return undefined
    }

    if (canTrack) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerout', onPointerOut)
    }
    root.addEventListener('pointerenter', onEnter)
    root.addEventListener('pointerleave', onLeave)

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else if (frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
    })
    observer.observe(root)
    applyGrow()
    stage.style.transform = buildTransform(baseRotation.x, baseRotation.y)
    start()

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onPointerOut)
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointerleave', onLeave)
      observer.disconnect()
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [autoOrbit, baseRotation, extent, hoverPush, orbitSpeed, pointerTracking, safeSmoothing, safeTilt])

  return (
    <span
      ref={rootRef}
      className={`depth-text ${className}`.trim()}
      style={{
        ...style,
        '--depth-text-perspective': `${perspective}px`,
        '--depth-text-font-size': fontSize,
        '--depth-text-font-weight': fontWeight,
        '--depth-text-face-color': faceColor,
        '--depth-text-shadow': shadow ? `0 .16em .32em color-mix(in srgb, ${depthColor} 28%, rgba(0,0,0,.42))` : 'none',
      }}
    >
      <span
        ref={stageRef}
        className="depth-text__stage"
        style={{ '--depth-text-grow': introDone ? 1 : 0 }}
      >
        {depthLayers.map(layer => (
          <span
            aria-hidden="true"
            className="depth-text__layer"
            key={layer.index}
            style={{ color: layer.color, transform: layer.transform }}
          >
            {text}
          </span>
        ))}
        <span className="depth-text__face">{text}</span>
      </span>
    </span>
  )
}
