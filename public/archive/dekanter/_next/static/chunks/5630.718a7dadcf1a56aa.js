"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5630],{3189:function(e,t,r){r.d(t,{j:function(){return l}});var n=r(2262),a=r(8427),i=r(7362),o=r(5369);let s={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},u={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},l=a.forwardRef((e,t)=>{let r,l,{scale:c=10,frames:v=1/0,opacity:f=1,width:h=1,height:m=1,blur:d=1,near:x=0,far:p=10,resolution:g=512,smooth:y=!0,color:D="#000000",depthWrite:M=!1,renderOrder:j,...U}=e,b=a.useRef(null),w=(0,o.D)(e=>e.scene),S=(0,o.D)(e=>e.gl),C=a.useRef(null);h*=Array.isArray(c)?c[0]:c||1,m*=Array.isArray(c)?c[1]:c||1;let[P,I,R,A,k,E,T]=a.useMemo(()=>{let e=new i.WebGLRenderTarget(g,g),t=new i.WebGLRenderTarget(g,g);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new i.PlaneGeometry(h,m).rotateX(Math.PI/2),n=new i.Mesh(r),a=new i.MeshDepthMaterial;a.depthTest=a.depthWrite=!1,a.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new i.Color(D)}},e.fragmentShader=e.fragmentShader.replace("void main() {","uniform vec3 ucolor;\n           void main() {\n          "),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let o=new i.ShaderMaterial(s),l=new i.ShaderMaterial(u);return l.depthTest=o.depthTest=!1,[e,r,a,n,o,l,t]},[g,h,m,c,D]),F=e=>{A.visible=!0,A.material=k,k.uniforms.tDiffuse.value=P.texture,k.uniforms.h.value=1*e/256,S.setRenderTarget(T),S.render(A,C.current),A.material=E,E.uniforms.tDiffuse.value=T.texture,E.uniforms.v.value=1*e/256,S.setRenderTarget(P),S.render(A,C.current),A.visible=!1},L=0;return(0,o.F)(()=>{C.current&&(v===1/0||L<v)&&(L++,r=w.background,l=w.overrideMaterial,b.current.visible=!1,w.background=null,w.overrideMaterial=R,S.setRenderTarget(P),S.render(w,C.current),F(d),y&&F(.4*d),S.setRenderTarget(null),b.current.visible=!0,w.overrideMaterial=l,w.background=r)}),a.useImperativeHandle(t,()=>b.current,[]),a.createElement("group",(0,n.Z)({"rotation-x":Math.PI/2},U,{ref:b}),a.createElement("mesh",{renderOrder:j,geometry:I,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},a.createElement("meshBasicMaterial",{transparent:!0,map:P.texture,opacity:f,depthWrite:M})),a.createElement("orthographicCamera",{ref:C,args:[-h/2,h/2,m/2,-m/2,x,p]}))})},1675:function(e,t,r){r.d(t,{M:function(){return u}});var n=r(87),a=r(8427),i=r(5369),o=r(9028),s=r(7362);function u(e){let{count:t=800}=e,r=(0,a.useRef)(null),u=(0,a.useMemo)(()=>{let e=new Float32Array(3*t);return(0,o.Qm)(e,{radius:6}),e},[t]);return(0,i.F)((e,t)=>{r.current&&(r.current.rotation.y+=.018*t,r.current.rotation.x+=.006*t)}),(0,n.jsxs)("points",{ref:r,frustumCulled:!1,children:[(0,n.jsx)("bufferGeometry",{children:(0,n.jsx)("bufferAttribute",{attach:"attributes-position",args:[u,3]})}),(0,n.jsx)("pointsMaterial",{size:.022,color:"#c57e5b",transparent:!0,opacity:.3,sizeAttenuation:!0,blending:s.AdditiveBlending,depthWrite:!1})]})}},1412:function(e,t,r){r.d(t,{E:function(){return h}});var n=r(87),a=r(8427),i=r(9929),o=r(7720),s=r(5240),u=r(9480),l=r(3496),c=r(8285),v=r(7141),f=r(7362);function h(){let e=(0,a.useMemo)(()=>new f.Vector2(8e-4,8e-4),[]);return(0,n.jsxs)(i.x,{multisampling:2,children:[(0,n.jsx)(o.d,{intensity:.45,luminanceThreshold:.7,luminanceSmoothing:.25,mipmapBlur:!0}),(0,n.jsx)(s.l,{mode:v.hm.ACES_FILMIC}),(0,n.jsx)(u.V,{offset:e,radialModulation:!1,modulationOffset:0}),(0,n.jsx)(l.c,{opacity:.04,premultiply:!0,blendFunction:v.YQ.OVERLAY}),(0,n.jsx)(c.s,{darkness:.55,offset:.3})]})}},3724:function(e,t,r){r.d(t,{B:function(){return p}});var n=r(87),a=r(8427),i=r(5369),o=r(7805),s=r(7362);let u={height:3.4,maxRadius:1.14,rings:224,radial:184,fold:{depth:.2,faceSpread:.5,yCenter:.42,uSpread:.62,vSpread:.3,slope:1.15,channel:.12,armWindow:.85}};u.height;let l=[[0,0],[.03,.44],[.08,.72],[.16,.91],[.3,1],[.45,.985],[.58,.895],[.68,.77],[.76,.58],[.82,.385],[.85,.265],[.875,.228],[.9,.228],[.925,.35],[.95,.404],[.965,.4],[.98,.315],[1,.21]],c=e=>e<0?0:e>1?1:e,v=(e,t,r)=>{let n=c((r-e)/(t-e));return n*n*(3-2*n)},f=2*Math.PI;function h(e){for(;e>Math.PI;)e-=f;for(;e<-Math.PI;)e+=f;return e}let m={green:{color:"#dcefe0",attenuationColor:"#2a7d4a",attenuationDistance:2.2},clear:{color:"#eef4f0",attenuationColor:"#d6e8da",attenuationDistance:3.6}},d=-u.height/2+.85*u.height,x=-u.height/2+.925*u.height;function p(e){let{tint:t="green",showStopper:r=!0,autoSpin:p=!1,reduce:g=!1}=e,y=(0,a.useRef)(null),D=(0,a.useMemo)(()=>(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,t=[],r=[],n=e.height,a=-n/2,i=e.radial+1;for(let r=0;r<=e.rings;r++){let i=r/e.rings,o=function(e){let t=c(e),r=0;for(;r<l.length-1&&l[r+1][0]<t;)r++;let n=l[Math.max(0,r-1)],a=l[Math.max(0,r)],i=l[Math.min(l.length-1,r+1)],o=l[Math.min(l.length-1,r+2)],s=i[0]-a[0]||1e-6,u=c((t-a[0])/s),v=u*u,f=.5*(2*a[1]+(-n[1]+i[1])*u+(2*n[1]-5*a[1]+4*i[1]-o[1])*v+(-n[1]+3*a[1]-3*i[1]+o[1])*(v*u));return f<0?0:f}(i)*e.maxRadius,s=a+i*n;for(let r=0;r<=e.radial;r++){let n=r/e.radial*f,a=Math.max(.05,o-function(e,t,r){let n=Math.abs(h(e-Math.PI/2)),a=Math.abs(h(e+Math.PI/2)),i=n<=a?h(e-Math.PI/2):h(e+Math.PI/2),o=Math.min(n,a),s=Math.exp(-(o*o)/(2*r.faceSpread*r.faceSpread)),u=i/r.uSpread,l=(t-r.yCenter)/r.vSpread,c=Math.sqrt(1+r.slope*r.slope),f=Math.min(Math.abs(l-r.slope*u)/c,Math.abs(l+r.slope*u)/c),m=Math.exp(-(f*f)/(2*r.channel*r.channel)),d=Math.exp(-(u*u+l*l)/(2*r.armWindow*r.armWindow)),x=v(.04,.16,t);return r.depth*s*m*d*x}(n,i,e.fold));t.push(Math.cos(n)*a,s,Math.sin(n)*a)}}for(let t=0;t<e.rings;t++)for(let n=0;n<e.radial;n++){let e=t*i+n,a=e+i;r.push(e,a,e+1,e+1,a,a+1)}let o=t.length/3;t.push(0,a,0);for(let t=0;t<e.radial;t++)r.push(o,t+1,t);let m=e.rings*i,d=t.length/3;t.push(0,a+n,0);for(let t=0;t<e.radial;t++)r.push(d,m+t,m+t+1);let x=new s.BufferGeometry;return x.setAttribute("position",new s.Float32BufferAttribute(t,3)),x.setIndex(r),x.computeVertexNormals(),x})(u),[]),M=(0,a.useMemo)(()=>(function(){let e=[[.001,0],[.205,0],[.205,.2],[.2,.225],[.255,.245],[.46,.275],[.465,.4],[.45,.45],[.4,.455],[.4,.49],[.3,.515],[.165,.53],[.001,.535]].map(e=>{let[t,r]=e;return new s.Vector2(t,r)}),t=new s.LatheGeometry(e,96);return t.computeVertexNormals(),t})(),[]),j=m[t];return(0,i.F)((e,t)=>{let r=y.current;r&&(p&&!g&&(r.rotation.y+=.25*Math.min(t,.05)),r.position.y=g?0:.03*Math.sin(.18*e.clock.elapsedTime))}),(0,n.jsxs)("group",{ref:y,children:[(0,n.jsx)("mesh",{geometry:D,children:(0,n.jsx)(o.z,{transmission:1,ior:1.52,thickness:1.6,roughness:.045,chromaticAberration:.02,distortion:0,temporalDistortion:0,color:j.color,attenuationColor:j.attenuationColor,attenuationDistance:j.attenuationDistance,backside:!0,samples:6,resolution:256})}),(0,n.jsxs)("mesh",{position:[0,d,0],rotation:[Math.PI/2,0,0],children:[(0,n.jsx)("torusGeometry",{args:[.34,.024,16,100]}),(0,n.jsx)("meshStandardMaterial",{color:"#8c5438",metalness:1,roughness:.34})]}),r&&(0,n.jsx)("mesh",{geometry:M,position:[0,x,0],children:(0,n.jsx)(o.z,{transmission:1,ior:1.52,thickness:.9,roughness:.05,color:j.color,attenuationColor:j.attenuationColor,attenuationDistance:j.attenuationDistance,samples:6,resolution:256})})]})}},5630:function(e,t,r){r.r(t),r.d(t,{default:function(){return p}});var n=r(87),a=r(9544),i=r(5733),o=r(4697),s=r(3189),u=r(4359),l=r(8427),c=r(2338),v=r(3724),f=r(1675),h=r(1412);function m(e){let{onReady:t}=e;return(0,l.useEffect)(()=>{null==t||t()},[t]),null}function d(){return(0,n.jsxs)(i.qA,{resolution:256,frames:1,background:!1,children:[(0,n.jsx)("color",{attach:"background",args:["#0c120e"]}),(0,n.jsx)(o.D,{form:"rect",intensity:2.1,color:"#f3f6ee",position:[-6,5,1],scale:[15,15,1],target:[0,0,0]}),(0,n.jsx)(o.D,{form:"rect",intensity:1,color:"#bcae93",position:[7,0,3],scale:[12,12,1],target:[0,0,0]}),(0,n.jsx)(o.D,{form:"rect",intensity:1.5,color:"#2f7d4f",position:[0,2,-7],scale:[11,9,1],target:[0,0,0]}),(0,n.jsx)(o.D,{form:"rect",intensity:.7,color:"#e7ead8",position:[0,9,0],rotation:[Math.PI/2,0,0],scale:[9,9,1],target:[0,0,0]})]})}function x(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("directionalLight",{position:[-4,5,3],intensity:3,color:"#fff1d6"}),(0,n.jsx)("spotLight",{position:[5,1.5,3.5],angle:.9,penumbra:1,decay:0,intensity:.8,color:"#15351f"}),(0,n.jsx)("spotLight",{position:[0,2.5,-5],angle:.45,penumbra:.6,decay:0,intensity:1.7,color:"#8c5438"}),(0,n.jsx)("ambientLight",{intensity:.2}),(0,n.jsx)("pointLight",{position:[.6,-.2,4.5],intensity:.5,decay:0,color:"#dfeede"})]})}function p(e){var t;let{tint:r="green",showStopper:i=!0,active:o=!0,onReady:p,dustCount:g=260,enableZoom:y=!0}=e,D=null!==(t=(0,c.J)())&&void 0!==t&&t;return(0,n.jsxs)(a.Xz,{flat:!0,frameloop:o?"always":"never",dpr:[1,1.6],camera:{position:[0,.2,6.8],fov:38},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},children:[(0,n.jsx)(x,{}),(0,n.jsxs)(l.Suspense,{fallback:null,children:[(0,n.jsx)(d,{}),(0,n.jsx)(v.B,{tint:r,showStopper:i,reduce:D}),(0,n.jsx)(s.j,{position:[0,-1.82,0],opacity:.5,blur:2.6,scale:7,far:4,resolution:512,color:"#04140a"}),(0,n.jsx)(f.M,{count:g}),(0,n.jsx)(m,{onReady:p})]}),(0,n.jsx)(u.z,{enablePan:!1,enableZoom:y,minPolarAngle:.12*Math.PI,maxPolarAngle:.86*Math.PI,autoRotate:!D,autoRotateSpeed:.6,minDistance:4.5,maxDistance:11,target:[0,0,0]}),(0,n.jsx)(h.E,{})]})}}}]);