import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DodgeField from './DodgeField'
import DepthText from './DepthText'
import './styles.css'

const experiences = [
  {
    period: '2026.02 — 2026.07',
    company: '十方融海公司',
    role: 'AI 视频工程师 · 设计部',
    copy: '参与生成式图像与视频模型的能力验证及商业内容制作，独立完成产品宣传片、功能演示、角色替换、场景转换与视频风格化案例，从创意构思、脚本分镜、AI 素材生成到剪辑包装完整落地。',
  },
  {
    period: '2026.07 — 至今',
    company: '大连鼎盛丰茂',
    role: '短剧制作师',
    copy: '独立完成《重生1998》《隐罪法医》两部短剧从剧本到成片的全流程制作，覆盖剧本拆解、分镜设计、拍摄执行、剪辑调色、动效包装与最终交付。',
  },
]

const projects = [
  {
    index: '01',
    tag: 'SHORT DRAMA · FULL PIPELINE',
    title: '《重生1998》',
    text: '独立完成内容拆解、镜头设计、拍摄组织和后期交付，建立从剧本到成片的一体化制作流程。',
    tone: 'violet',
    href: '/works/chong-sheng-1998-web.mp4',
    preview: '/works/chong-sheng-1998-preview.mp4',
  },
  {
    index: '02',
    tag: 'SHORT DRAMA · NARRATIVE',
    title: '《隐罪法医》',
    text: '围绕悬疑叙事控制信息释放与镜头节奏，完成剧本视觉化、现场执行及成片包装。',
    tone: 'blue',
    href: '/works/yin-zui-fa-yi-web.mp4',
    preview: '/works/yin-zui-fa-yi-preview.mp4',
  },
  {
    index: '03',
    tag: 'WINTER VISUAL · CAMPAIGN',
    title: '冬季场景视觉短片',
    text: '以冰雪环境与作业车辆为核心视觉，强化动态冲击、季节氛围和宣传信息的快速传达。',
    tone: 'blue',
    href: '/works/work-04-web.mp4',
    preview: '/works/work-04-preview.mp4',
  },
  {
    index: '04',
    tag: 'CITY SERVICE · PROMOTIONAL FILM',
    title: '城市服务宣传片',
    text: '围绕城市道路服务场景组织叙事，通过机构形象、工作环境与职能信息建立清晰的内容节奏。',
    tone: 'violet',
    href: '/works/work-05-web.mp4',
    preview: '/works/work-05-preview.mp4',
  },
  {
    index: '05',
    tag: 'AI NARRATIVE · CHARACTER',
    title: 'AI 人物剧情实验',
    text: '聚焦双人对话与人物关系表达，完成角色一致性、表演节奏、镜头衔接与生活化场景塑造。',
    tone: 'cyan',
    href: '/works/work-06-web.mp4',
    preview: '/works/work-06-preview.mp4',
  },
  {
    index: '06',
    tag: 'SEASONAL FILM · FESTIVAL',
    title: '节日氛围影像',
    text: '从传统节日意象出发，以自然光影、静物细节和舒缓节奏构建具有温度的东方生活画面。',
    tone: 'blue',
    href: '/works/work-07-web.mp4',
    preview: '/works/work-07-preview.mp4',
  },
  {
    index: '07',
    tag: 'SPACE VISUAL · BRAND FILM',
    title: '空间景观视觉片',
    text: '通过景观动线、前后景层次与光影变化呈现空间质感，完成兼具氛围与商业表达的视觉短片。',
    tone: 'violet',
    href: '/works/work-08-web.mp4',
    preview: '/works/work-08-preview.mp4',
  },
]

const skills = [
  ['01', 'AI 视觉生成', '熟悉主流图像与视频模型的能力边界、选型逻辑与提示词调试。'],
  ['02', '脚本与分镜', '使用 AI 辅助剧本优化、视觉拆解和可执行分镜设计。'],
  ['03', '全流程制作', '从需求、创意、拍摄到剪辑、调色、动效与多平台版本适配。'],
  ['04', '商业交付', '在有限预算和周期内平衡创意、成本与传播目标。'],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function DodgeButton({ href, className = '', children }) {
  return (
    <span className="dodgeButtonSlot">
      <DodgeField
        className="buttonDodgeField"
        fieldHeight={96}
        reach={18}
        radius={70}
        falloff={3.2}
        fleeDuration={180}
        returnDuration={420}
        returnBounce={0}
        axis="both"
        wall="clamp"
        patience={2}
      >
        <a className={className} href={href}>{children}</a>
      </DodgeField>
    </span>
  )
}

function DepthTitleLine({ text, hero = false }) {
  return (
    <DepthText
      text={text}
      className={hero ? 'depthTitle depthTitleHero' : 'depthTitle'}
      layers={hero ? 28 : 18}
      depth={hero ? 1.15 : 0.72}
      depthColor={hero ? '#67d7ff' : '#7658ff'}
      tilt={hero ? 5 : 3.5}
      perspective={hero ? 1000 : 1100}
      autoOrbit
      orbitSpeed={hero ? 0.08 : 0.045}
      hoverPush={hero ? 0.22 : 0.14}
      fontSize="inherit"
      fontWeight={800}
      shadow
      intro
    />
  )
}

function App() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const ensurePlayback = () => {
      video.muted = true
      if (video.paused) video.play().catch(() => {})
    }

    ensurePlayback()
    video.addEventListener('canplay', ensurePlayback)
    window.addEventListener('pageshow', ensurePlayback)
    document.addEventListener('visibilitychange', ensurePlayback)

    return () => {
      video.removeEventListener('canplay', ensurePlayback)
      window.removeEventListener('pageshow', ensurePlayback)
      document.removeEventListener('visibilitychange', ensurePlayback)
    }
  }, [])

  return (
    <main>
      <section className="hero" id="top">
        <video
          ref={videoRef}
          className="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero-background-h264.mp4" type="video/mp4" />
        </video>
        <div className="heroShade" />

        <header className="nav shell">
          <a className="brand" href="#top" aria-label="返回首页">YLS&nbsp;&nbsp;/&nbsp;&nbsp;PORTFOLIO</a>
          <div className="navRule" />
          <nav aria-label="主要导航">
            <a href="#work">WORK</a>
            <a href="#profile">PROFILE</a>
            <a href="#contact">CONTACT</a>
          </nav>
        </header>

        <div className="heroContent shell">
          <div className="eyebrow"><span>01</span><i />AI VIDEO × VISUAL DESIGN</div>
          <h1><DepthTitleLine text="个人作品集" hero /></h1>
          <p className="heroRole">叶李硕｜AI 视频工程师 · 短剧制作师 · 视觉设计方向</p>
          <p className="heroTagline">把模型能力，变成可传播的内容。</p>
          <p className="heroWechat"><span>WECHAT</span>微信：15919444743</p>
          <div className="heroActions">
            <DodgeButton className="primaryButton" href="#work">查看精选作品 <Arrow /></DodgeButton>
            <DodgeButton className="secondaryButton" href="#contact">联系合作 <Arrow /></DodgeButton>
          </div>
        </div>

        <a className="scrollCue" href="#profile">
          <span className="scrollLine"><i /></span>
          SCROLL TO EXPLORE
        </a>
      </section>

      <section className="profile section" id="profile">
        <div className="shell">
          <div className="sectionLabel">01 / PROFILE</div>
          <div className="profileLead">
            <h2 className="depthHeading">
              <DepthTitleLine text="经历不是时间线，" />
              <DepthTitleLine text="是持续交付的证据。" />
            </h2>
            <p>把模型能力、叙事判断和制作执行放在同一条工作流里，完成从想法到成片的闭环。</p>
          </div>

          <div className="profileGrid">
            <aside className="identityCard">
              <div className="avatarMark" aria-hidden="true" />
              <h3>叶李硕</h3>
              <p>AI 视频工程师 / 短剧制作师</p>
              <address>
                <a href="mailto:2435124664@qq.com">2435124664@qq.com</a>
                <a href="tel:15919444743">159 1944 4743</a>
              </address>
              <div className="metrics">
                <div><strong>26</strong><span>商业项目</span></div>
                <div><strong>2</strong><span>独立短剧</span></div>
                <div><strong>100%</strong><span>按期交付</span></div>
              </div>
            </aside>

            <div className="experiencePanel">
              <div className="panelTitle">EXPERIENCE / 2026</div>
              {experiences.map((item) => (
                <article className="experienceItem" key={item.company}>
                  <time>{item.period}</time>
                  <h3>{item.company}｜{item.role}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell">
          <div className="sectionHeading">
            <div>
              <div className="sectionLabel">02 / SELECTED WORK</div>
              <h2 className="depthHeading">
                <DepthTitleLine text="让每一个镜头，" />
                <DepthTitleLine text="都有明确的任务。" />
              </h2>
            </div>
            <p>项目不只是结果展示，也是对叙事、技术选择与交付能力的记录。</p>
          </div>

          <div className="projectGrid">
            {projects.map((project) => {
              const ProjectCard = project.href ? 'a' : 'article'
              return (
                <ProjectCard
                  className={`projectCard ${project.tone}${project.href ? ' projectCardLink' : ''}`}
                  href={project.href}
                  aria-label={project.href ? `观看${project.title}完整视频` : undefined}
                  key={project.title}
                >
                  <div className="projectVisual">
                    {project.preview && (
                      <video
                        className="projectPreview"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      >
                        <source src={project.preview} type="video/mp4" />
                      </video>
                    )}
                    {project.preview && <div className="projectPreviewShade" />}
                    <span className="projectIndex">{project.index}</span>
                    {!project.preview && <div className="orb" />}
                    <span className="projectTag">{project.tag}</span>
                    {project.href && <span className="projectPlay">PLAY&nbsp;&nbsp;↗</span>}
                  </div>
                  <div className="projectCopy">
                    <h3>{project.title}</h3>
                    <p>{project.text}</p>
                    {project.href && <span className="projectWatch">观看完整视频 <Arrow /></span>}
                  </div>
                </ProjectCard>
              )
            })}
          </div>
          <div className="workCta">
            <div>
              <span>MORE WORKS / PRIVATE CASES</span>
              <p>更多完整作品及未公开项目案例，欢迎通过下方联系方式进一步了解。</p>
            </div>
            <DodgeButton className="workCtaButton" href="#contact">获取更多作品 <Arrow /></DodgeButton>
          </div>
        </div>
      </section>

      <section className="capabilities section">
        <div className="shell capabilitiesGrid">
          <div>
            <div className="sectionLabel">03 / CAPABILITIES</div>
            <h2 className="depthHeading">
              <DepthTitleLine text="从创意判断，" />
              <DepthTitleLine text="到可交付的成片。" />
            </h2>
          </div>
          <div className="skillList">
            {skills.map(([num, title, copy]) => (
              <article key={num}>
                <span>{num}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contactGlow" />
        <div className="shell contactInner">
          <div className="sectionLabel">04 / CONTACT</div>
          <h2 className="depthHeading">
            <DepthTitleLine text="让想法成为下一支" />
            <DepthTitleLine text="值得被看见的作品。" />
          </h2>
          <div className="contactDetails">
            <a className="contactDetail" href="tel:15919444743">
              <span>PHONE / 手机号</span>
              <strong>159 1944 4743</strong>
              <Arrow />
            </a>
            <a className="contactDetail" href="mailto:2435124664@qq.com">
              <span>QQ MAIL / QQ 邮箱</span>
              <strong>2435124664@qq.com</strong>
              <Arrow />
            </a>
            <div className="contactDetail">
              <span>WECHAT / 微信</span>
              <strong>15919444743</strong>
              <em>可直接添加</em>
            </div>
          </div>
          <div className="footerMeta">
            <span>叶李硕 · AI VIDEO / VISUAL DESIGN</span>
            <a href="#top">BACK TO TOP ↑</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
