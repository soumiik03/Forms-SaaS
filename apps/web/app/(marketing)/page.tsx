"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

/* ── TOKENS ───────────────────────────────────────────────── */
const C = {
  bg:      "#F5F0E8",
  bgAlt:   "#EDE8DC",
  dark:    "#0F0D0A",
  mid:     "#3D3730",
  muted:   "rgba(15,13,10,0.45)",
  subtle:  "rgba(15,13,10,0.22)",
  line:    "rgba(15,13,10,0.1)",
  red:     "#C93030",
  redDark: "#8B1A1A",
  gold:    "#B87A1A",
  goldBg:  "rgba(184,122,26,0.1)",
  goldBdr: "rgba(184,122,26,0.3)",
  green:   "#1F6B3A",
}

/* ── PARTICLE CANVAS ──────────────────────────────────────── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener("resize", resize)
    type P = { x:number;y:number;vx:number;vy:number;w:number;h:number;color:string;alpha:number }
    const colors = ["#C93030","#C93030","#B87A1A","#B87A1A","#1F6B3A","#1A3A8C","#8B1A1A"]
    const ps: P[] = Array.from({length:90},()=>({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
      w:Math.random()*5+2, h:Math.random()*12+4,
      color:colors[Math.floor(Math.random()*colors.length)]!,
      alpha:Math.random()*.4+.1,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      ps.forEach(p=>{
        ctx.save(); ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color
        ctx.translate(p.x+p.w/2,p.y+p.h/2)
        ctx.rotate(Math.atan2(p.vy,p.vx)+Math.PI/2)
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h)
        ctx.restore()
        p.x+=p.vx; p.y+=p.vy
        if(p.x<-20)p.x=canvas.width+20; if(p.x>canvas.width+20)p.x=-20
        if(p.y<-20)p.y=canvas.height+20; if(p.y>canvas.height+20)p.y=-20
      })
      raf=requestAnimationFrame(draw)
    }
    draw()
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize)}
  },[])
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}} />
}

/* ── BUTTON ───────────────────────────────────────────────── */
type BtnVariant = "primary"|"ghost"|"outline"
function Btn({href,children,variant="primary",size="md",style:s}:{
  href?:string; children:React.ReactNode; variant?:BtnVariant; size?:"sm"|"md"|"lg"; style?:React.CSSProperties
}) {
  const pad = size==="sm"?"8px 18px":size==="lg"?"15px 36px":"11px 26px"
  const fs  = size==="sm"?13:size==="lg"?15:14

  const base:React.CSSProperties = {
    display:"inline-flex",alignItems:"center",gap:7,
    padding:pad,fontSize:fs,fontWeight:600,
    textDecoration:"none",cursor:"pointer",
    letterSpacing:"-0.1px",whiteSpace:"nowrap",
    transition:"all .12s ease",userSelect:"none",
    fontFamily:"inherit",border:"none",
  }
  const styles:Record<BtnVariant,React.CSSProperties> = {
    primary: {...base,background:C.dark,color:C.bg,
      boxShadow:`3px 3px 0 ${C.gold}`,border:`1.5px solid ${C.dark}`},
    ghost:   {...base,background:"transparent",color:C.mid,border:"1.5px solid transparent"},
    outline: {...base,background:"transparent",color:C.dark,
      border:`1.5px solid ${C.line}`,boxShadow:"3px 3px 0 rgba(15,13,10,0.08)"},
  }
  const hover = {
    primary: {transform:"translate(2px,2px)",boxShadow:`1px 1px 0 ${C.gold}`},
    ghost:   {color:C.dark,background:"rgba(15,13,10,0.05)"},
    outline: {transform:"translate(2px,2px)",boxShadow:"1px 1px 0 rgba(15,13,10,0.08)",borderColor:"rgba(15,13,10,0.25)"},
  }
  const [hov,setHov]=useState(false)
  const merged = hov?{...styles[variant],...hover[variant],...s}:{...styles[variant],...s}
  if(href) return(
    <Link href={href} style={merged}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </Link>
  )
  return <button style={merged} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>{children}</button>
}

/* ── NAVBAR ───────────────────────────────────────────────── */
function Navbar() {
  const [scrolled,setScrolled]=useState(false)
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20)
    window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn)
  },[])
  return(
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 40px",height:60,
      background: scrolled?"rgba(245,240,232,0.94)":"rgba(245,240,232,0.7)",
      backdropFilter:"blur(20px)",
      borderBottom:`1px solid ${scrolled?C.line:"transparent"}`,
      transition:"all .25s ease",
    }}>
      {/* Logo */}
      <Link href="/" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none"}}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill={C.dark}/>
          <rect x="6" y="6" width="7" height="7" fill={C.bg}/>
          <rect x="15" y="6" width="7" height="7" fill={C.red}/>
          <rect x="6" y="15" width="7" height="7" fill={C.gold}/>
          <rect x="15" y="15" width="7" height="7" fill={C.bg}/>
        </svg>
        <span style={{fontSize:16,fontWeight:700,color:C.dark,letterSpacing:"-0.3px"}}>
          Formulate
        </span>
      </Link>

      {/* Center nav */}
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        {["Product","Pricing","Templates","Docs"].map(l=>(
          <Link key={l} href={`#${l.toLowerCase()}`} style={{
            padding:"6px 14px",fontSize:14,fontWeight:500,
            color:C.muted,textDecoration:"none",
            borderRadius:6,transition:"all .15s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.color=C.dark;e.currentTarget.style.background="rgba(15,13,10,0.06)"}}
          onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.background="transparent"}}
          >{l}</Link>
        ))}
      </div>

      {/* Right */}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <Btn href="/login" variant="ghost" size="sm">Sign in</Btn>
        <Btn href="/register" variant="primary" size="sm">Get started →</Btn>
      </div>
    </nav>
  )
}

/* ── HERO ─────────────────────────────────────────────────── */
function Hero() {
  return(
    <section style={{
      minHeight:"100vh",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      textAlign:"center",padding:"120px 24px 80px",
      position:"relative",zIndex:1,
    }}>
      {/* Pill badge */}
      <div style={{
        display:"inline-flex",alignItems:"center",gap:8,
        padding:"5px 14px 5px 8px",
        background:C.goldBg,border:`1px solid ${C.goldBdr}`,
        borderRadius:99,marginBottom:32,
      }}>
        <span style={{
          background:C.green,color:"#fff",
          fontSize:10,fontWeight:700,letterSpacing:"0.5px",
          padding:"2px 8px",borderRadius:99,
        }}>NEW</span>
        <span style={{fontSize:13,fontWeight:500,color:C.gold}}>
          Mario-themed templates now available
        </span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize:"clamp(44px,7vw,96px)",fontWeight:800,
        lineHeight:1.02,letterSpacing:"-3px",
        color:C.dark,maxWidth:820,marginBottom:24,
      }}>
        Forms that people actually want to fill
      </h1>

      <p style={{
        fontSize:"clamp(16px,1.6vw,20px)",fontWeight:400,lineHeight:1.75,
        color:C.muted,maxWidth:500,marginBottom:48,
      }}>
        Formulate is a form builder for creators who care about experience.
        Create, publish, and collect responses — beautifully.
      </p>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:56}}>
        <Btn href="/register" size="lg">Start building — free</Btn>
        <Btn href="#product" size="lg" variant="outline">See how it works</Btn>
      </div>

      {/* Trust strip */}
      <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
        <span style={{fontSize:13,color:C.subtle,fontWeight:500}}>No credit card required</span>
        <span style={{color:C.line}}>·</span>
        <span style={{fontSize:13,color:C.subtle,fontWeight:500}}>Free forever plan</span>
        <span style={{color:C.line}}>·</span>
        <span style={{fontSize:13,color:C.subtle,fontWeight:500}}>3,200+ creators</span>
      </div>
    </section>
  )
}

/* ── DASHBOARD MOCKUP ─────────────────────────────────────── */
function Mockup() {
  return(
    <section id="product" style={{position:"relative",zIndex:1,padding:"0 40px 120px"}}>
      <div style={{
        maxWidth:1080,margin:"0 auto",
        border:`1.5px solid rgba(15,13,10,0.13)`,
        boxShadow:`0 40px 100px rgba(15,13,10,0.12), 4px 4px 0 ${C.gold}`,
        overflow:"hidden",background:"#FDFAF4",
      }}>
        {/* Chrome bar */}
        <div style={{
          display:"flex",alignItems:"center",gap:8,padding:"11px 18px",
          background:C.bgAlt,borderBottom:`1px solid rgba(15,13,10,0.1)`,
        }}>
          {[C.red,C.gold,C.green].map(c=>(
            <div key={c} style={{width:11,height:11,borderRadius:"50%",background:c,opacity:.8}}/>
          ))}
          <div style={{
            flex:1,display:"flex",justifyContent:"center",
          }}>
            <div style={{
              padding:"3px 20px",background:"rgba(15,13,10,0.07)",
              borderRadius:6,fontSize:11,fontWeight:500,color:C.muted,
              fontFamily:"monospace",
            }}>formulate.app/dashboard</div>
          </div>
        </div>

        <div style={{display:"flex",height:480}}>
          {/* Sidebar */}
          <div style={{
            width:200,borderRight:`1px solid rgba(15,13,10,0.08)`,
            padding:"20px 12px",display:"flex",flexDirection:"column",gap:2,
            background:"#FAF7EF",flexShrink:0,
          }}>
            {[
              {icon:"▦",label:"Dashboard",active:true},
              {icon:"◈",label:"My Forms",active:false},
              {icon:"◎",label:"Responses",active:false},
              {icon:"◐",label:"Analytics",active:false},
              {icon:"◻",label:"Templates",active:false},
            ].map(i=>(
              <div key={i.label} style={{
                display:"flex",alignItems:"center",gap:9,
                padding:"8px 10px",borderRadius:6,
                background:i.active?"rgba(15,13,10,0.07)":"transparent",
                cursor:"default",
              }}>
                <span style={{fontSize:12,color:i.active?C.dark:C.muted}}>{i.icon}</span>
                <span style={{
                  fontSize:13,fontWeight:i.active?600:400,
                  color:i.active?C.dark:C.muted,
                }}>{i.label}</span>
              </div>
            ))}
          </div>

          {/* Main */}
          <div style={{flex:1,padding:"24px 28px",overflow:"hidden"}}>
            <div style={{
              display:"flex",justifyContent:"space-between",
              alignItems:"center",marginBottom:24,
            }}>
              <div>
                <div style={{fontSize:18,fontWeight:700,color:C.dark,letterSpacing:"-0.5px"}}>
                  Dashboard
                </div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>Welcome back, Soumik</div>
              </div>
              <div style={{
                padding:"7px 16px",background:C.dark,color:C.bg,
                fontSize:12,fontWeight:600,cursor:"default",
                boxShadow:`2px 2px 0 ${C.gold}`,
              }}>+ New Form</div>
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
              {[
                {label:"Total Forms",value:"12",color:C.dark},
                {label:"Responses",value:"847",color:C.red},
                {label:"Live",value:"8",color:C.green},
                {label:"Avg. Completion",value:"73%",color:C.gold},
              ].map(s=>(
                <div key={s.label} style={{
                  padding:"14px 16px",
                  background:C.bg,border:`1px solid rgba(15,13,10,0.09)`,
                }}>
                  <div style={{fontSize:11,color:C.muted,marginBottom:6,fontWeight:500}}>{s.label}</div>
                  <div style={{fontSize:24,fontWeight:800,color:s.color,letterSpacing:"-1px"}}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Form list */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {name:"Gamer Feedback Survey",r:142,live:true,tag:"🎮 Games"},
                {name:"Startup Application Form",r:89,live:true,tag:"🚀 Startup"},
                {name:"Anime Season Poll",r:0,live:false,tag:"🌸 Anime"},
              ].map(f=>(
                <div key={f.name} style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"12px 16px",
                  background:"#FAF7EF",border:`1px solid rgba(15,13,10,0.08)`,
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{
                      width:6,height:6,borderRadius:"50%",flexShrink:0,
                      background:f.live?C.green:"rgba(15,13,10,0.2)",
                    }}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:C.dark}}>{f.name}</div>
                      <div style={{fontSize:11,color:C.muted,marginTop:1}}>{f.tag}</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,fontWeight:500,color:C.muted}}>
                    {f.live?`${f.r} responses`:"Draft"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FEATURES ─────────────────────────────────────────────── */
function Features() {
  const items = [
    {icon:"⚡",title:"Drag & drop builder",desc:"Add fields, configure validation, reorder questions. Building a form should feel effortless — and it does."},
    {icon:"🔗",title:"Public & unlisted forms",desc:"Public forms appear in the Explore gallery. Unlisted forms stay hidden — only people with the direct link can access them."},
    {icon:"📊",title:"Response analytics",desc:"Completion rates, view counts, field breakdowns. Everything you need to understand your respondents."},
    {icon:"🎨",title:"Themed templates",desc:"Start from a gallery of themed templates — games, startups, events, communities. Launch in seconds."},
    {icon:"🔒",title:"Production security",desc:"Rate limiting, bcrypt hashing, secure session tokens, Helmet headers. Your data is always protected."},
    {icon:"📡",title:"REST + tRPC API",desc:"Full OpenAPI documentation via Scalar. Integrate Formulate with any tool in your stack."},
  ]
  return(
    <section id="features" style={{
      position:"relative",zIndex:1,
      padding:"100px 40px",
      background:C.bgAlt,
      borderTop:`1px solid ${C.line}`,
      borderBottom:`1px solid ${C.line}`,
    }}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:"2.5px",color:C.gold,textTransform:"uppercase",marginBottom:14}}>
            Features
          </p>
          <h2 style={{
            fontSize:"clamp(28px,4vw,52px)",fontWeight:800,
            letterSpacing:"-1.8px",color:C.dark,lineHeight:1.08,marginBottom:16,
          }}>
            Everything in one place
          </h2>
          <p style={{fontSize:17,color:C.muted,maxWidth:420,margin:"0 auto",lineHeight:1.7}}>
            Every tool a form creator needs — built in, not bolted on.
          </p>
        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(3,1fr)",
          border:`1.5px solid rgba(15,13,10,0.11)`,
        }}>
          {items.map((f,i)=>(
            <FeatureCard key={f.title} {...f} i={i} total={items.length}/>
          ))}
        </div>
      </div>
    </section>
  )
}
function FeatureCard({icon,title,desc,i,total}:{icon:string;title:string;desc:string;i:number;total:number}) {
  const [hov,setHov]=useState(false)
  const cols=3
  const isLastRow = i >= total-cols
  const isRightCol = (i+1)%cols===0
  return(
    <div style={{
      padding:"36px 32px",
      background:hov?"#FDFAF4":"#FAF7EF",
      borderRight:isRightCol?"none":`1px solid rgba(15,13,10,0.08)`,
      borderBottom:isLastRow?"none":`1px solid rgba(15,13,10,0.08)`,
      transition:"background .18s",cursor:"default",
    }}
    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{fontSize:26,marginBottom:16}}>{icon}</div>
      <h3 style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:10,letterSpacing:"-0.3px"}}>{title}</h3>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.72}}>{desc}</p>
    </div>
  )
}

/* ── HOW IT WORKS ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {n:"01",title:"Create your form",desc:"Sign up and use the drag-and-drop builder to add fields, set validation rules, and configure your form in minutes."},
    {n:"02",title:"Publish and share",desc:"One click to publish. Share your link directly or list it publicly on the Explore page for anyone to discover."},
    {n:"03",title:"Collect and analyze",desc:"Watch responses arrive in real time. View analytics, filter results, and export data — all in one clean dashboard."},
  ]
  return(
    <section style={{position:"relative",zIndex:1,padding:"100px 40px"}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:"2.5px",color:C.gold,textTransform:"uppercase",marginBottom:14}}>
            How it works
          </p>
          <h2 style={{
            fontSize:"clamp(28px,4vw,52px)",fontWeight:800,
            letterSpacing:"-1.8px",color:C.dark,lineHeight:1.08,
          }}>
            Up and running in minutes
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2}}>
          {steps.map((s,i)=>(
            <div key={s.n} style={{padding:"0 32px 0 0"}}>
              <div style={{
                fontFamily:"monospace",fontSize:11,fontWeight:700,
                color:C.gold,letterSpacing:"2px",marginBottom:20,
              }}>{s.n}</div>
              {i<steps.length-1&&(
                <div style={{
                  position:"absolute",top:6,right:0,
                  width:24,height:1,background:C.line,
                }}/>
              )}
              <h3 style={{
                fontSize:18,fontWeight:700,color:C.dark,
                letterSpacing:"-0.5px",marginBottom:12,
              }}>{s.title}</h3>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.75}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PRICING ──────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name:"Free",price:"$0",period:"forever",
      desc:"Perfect for trying out Formulate.",
      features:["3 active forms","100 responses / month","Basic field types","Public forms","Formulate branding"],
      cta:"Get started",featured:false,
    },
    {
      name:"Pro",price:"$12",period:"per creator / month",
      desc:"For creators who need more power.",
      features:["Unlimited forms","10,000 responses / month","All field types","Public + Unlisted forms","Analytics dashboard","Remove branding","Email notifications"],
      cta:"Start free trial",featured:true,
    },
    {
      name:"Team",price:"$39",period:"per team / month",
      desc:"For teams building together.",
      features:["Everything in Pro","Unlimited responses","Team workspace","Full API access","Priority support","Custom domain","SSO"],
      cta:"Contact sales",featured:false,
    },
  ]
  return(
    <section id="pricing" style={{
      position:"relative",zIndex:1,
      padding:"100px 40px",
      background:C.bgAlt,
      borderTop:`1px solid ${C.line}`,
      borderBottom:`1px solid ${C.line}`,
    }}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:"2.5px",color:C.gold,textTransform:"uppercase",marginBottom:14}}>
            Pricing
          </p>
          <h2 style={{
            fontSize:"clamp(28px,4vw,52px)",fontWeight:800,
            letterSpacing:"-1.8px",color:C.dark,lineHeight:1.08,marginBottom:16,
          }}>Simple, honest pricing</h2>
          <p style={{fontSize:17,color:C.muted,lineHeight:1.7}}>
            Start free. Upgrade when you're ready.
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,alignItems:"start"}}>
          {plans.map(p=><PricingCard key={p.name} {...p}/>)}
        </div>
      </div>
    </section>
  )
}
function PricingCard({name,price,period,desc,features,cta,featured}:{
  name:string;price:string;period:string;desc:string;
  features:string[];cta:string;featured:boolean
}) {
  return(
    <div style={{
      padding:"36px 28px",position:"relative",
      background:featured?C.dark:"#FAF7EF",
      border:featured?`2px solid ${C.red}`:`1.5px solid rgba(15,13,10,0.11)`,
      boxShadow:featured?`4px 4px 0 ${C.red}`:`4px 4px 0 rgba(15,13,10,0.08)`,
      transform:featured?"translateY(-10px)":"none",
    }}>
      {featured&&(
        <div style={{
          position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
          background:C.red,color:"#fff",
          fontSize:10,fontWeight:700,letterSpacing:"1px",
          padding:"3px 14px",whiteSpace:"nowrap",
        }}>MOST POPULAR</div>
      )}
      <div style={{fontSize:12,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",
        color:featured?"rgba(245,240,232,0.45)":C.subtle,marginBottom:20}}>{name}</div>
      <div style={{
        fontSize:52,fontWeight:900,letterSpacing:"-2.5px",lineHeight:1,
        color:featured?"#F5F0E8":C.dark,marginBottom:4,
      }}>{price}</div>
      <div style={{fontSize:13,color:featured?"rgba(245,240,232,0.4)":C.muted,marginBottom:8}}>{period}</div>
      <div style={{fontSize:13.5,color:featured?"rgba(245,240,232,0.55)":C.muted,
        marginBottom:24,lineHeight:1.6}}>{desc}</div>
      <div style={{height:1,background:featured?"rgba(245,240,232,0.09)":C.line,marginBottom:24}}/>
      <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:11,marginBottom:32}}>
        {features.map(f=>(
          <li key={f} style={{fontSize:13.5,color:featured?"rgba(245,240,232,0.65)":C.muted,
            display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:C.green,fontSize:12,flexShrink:0,fontWeight:700}}>✓</span>{f}
          </li>
        ))}
      </ul>
      <Btn href="/register" variant={featured?"primary":"outline"} size="md"
        style={featured?{background:"#F5F0E8",color:C.dark,border:"none",
          boxShadow:`3px 3px 0 ${C.gold}`,width:"100%",justifyContent:"center"}:
          {width:"100%",justifyContent:"center"}}>
        {cta}
      </Btn>
    </div>
  )
}

/* ── SOCIAL PROOF ─────────────────────────────────────────── */
function SocialProof() {
  const quotes = [
    {q:"Formulate replaced three tools we were using. Our response rate went up 40%.",name:"Aryan K.",role:"Product Manager"},
    {q:"The cleanest form builder I've ever used. Setup took less than 5 minutes.",name:"Priya S.",role:"Founder, Buildspace"},
    {q:"Finally a form tool that doesn't look like it was built in 2012.",name:"Dev M.",role:"Designer at Linear"},
  ]
  return(
    <section style={{position:"relative",zIndex:1,padding:"100px 40px"}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <h2 style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:800,
            letterSpacing:"-1.8px",color:C.dark,lineHeight:1.08}}>
            Loved by creators
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {quotes.map(q=>(
            <div key={q.name} style={{
              padding:"28px",
              background:"#FAF7EF",
              border:`1.5px solid rgba(15,13,10,0.1)`,
            }}>
              <p style={{fontSize:15,color:C.mid,lineHeight:1.7,marginBottom:20,fontStyle:"italic"}}>
                "{q.q}"
              </p>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{
                  width:36,height:36,borderRadius:"50%",
                  background:C.dark,color:C.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:13,fontWeight:700,flexShrink:0,
                }}>{q.name[0]}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.dark}}>{q.name}</div>
                  <div style={{fontSize:12,color:C.muted}}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA ──────────────────────────────────────────────────── */
function CTA() {
  return(
    <section style={{position:"relative",zIndex:1,padding:"0 40px 120px"}}>
      <div style={{
        maxWidth:760,margin:"0 auto",padding:"80px 64px",
        background:C.dark,textAlign:"center",
        boxShadow:`6px 6px 0 ${C.gold}`,
        border:`2px solid rgba(245,240,232,0.08)`,
      }}>
        <h2 style={{
          fontSize:"clamp(28px,3.5vw,46px)",fontWeight:800,
          color:"#F5F0E8",letterSpacing:"-1.8px",lineHeight:1.1,marginBottom:16,
        }}>
          Start building today
        </h2>
        <p style={{fontSize:17,color:"rgba(245,240,232,0.5)",lineHeight:1.7,marginBottom:40}}>
          Free forever. No credit card. No friction.
        </p>
        <Btn href="/register" size="lg"
          style={{background:"#F5F0E8",color:C.dark,border:"none",
            boxShadow:`3px 3px 0 ${C.gold}`,justifyContent:"center"}}>
          Create your free account →
        </Btn>
      </div>
    </section>
  )
}

/* ── FOOTER ───────────────────────────────────────────────── */
function Footer() {
  return(
    <footer style={{
      position:"relative",zIndex:1,
      padding:"32px 40px",
      borderTop:`1px solid ${C.line}`,
      display:"flex",alignItems:"center",
      justifyContent:"space-between",flexWrap:"wrap",gap:20,
    }}>
      <span style={{fontSize:15,fontWeight:700,color:C.dark,letterSpacing:"-0.3px"}}>Formulate</span>
      <span style={{fontSize:13,color:C.subtle}}>© 2025 Formulate. All rights reserved.</span>
      <div style={{display:"flex",gap:24}}>
        {["Privacy","Terms","Docs","GitHub"].map(l=>(
          <Link key={l} href="#" style={{fontSize:13,color:C.muted,textDecoration:"none",fontWeight:500,transition:"color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.color=C.dark}
            onMouseLeave={e=>e.currentTarget.style.color=C.muted}>{l}</Link>
        ))}
      </div>
    </footer>
  )
}

/* ── PAGE ─────────────────────────────────────────────────── */
export default function LandingPage() {
  return(
    <main style={{background:C.bg,minHeight:"100vh",position:"relative"}}>
      <Particles/>
      <Navbar/>
      <Hero/>
      <Mockup/>
      <Features/>
      <HowItWorks/>
      <SocialProof/>
      <Pricing/>
      <CTA/>
      <Footer/>
    </main>
  )
}
