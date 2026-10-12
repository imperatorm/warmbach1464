"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[711],{3189:function(e,t,r){r.d(t,{j:function(){return l}});var n=r(2262),i=r(8427),a=r(5528),s=r(5369);let o={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
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
  `},l=i.forwardRef((e,t)=>{let r,l,{scale:c=10,frames:f=1/0,opacity:v=1,width:h=1,height:d=1,blur:m=1,near:p=0,far:x=10,resolution:g=512,smooth:y=!0,color:D="#000000",depthWrite:M=!1,renderOrder:j,...b}=e,U=i.useRef(null),w=(0,s.D)(e=>e.scene),T=(0,s.D)(e=>e.gl),R=i.useRef(null);h*=Array.isArray(c)?c[0]:c||1,d*=Array.isArray(c)?c[1]:c||1;let[S,k,A,C,E,P,L]=i.useMemo(()=>{let e=new a.WebGLRenderTarget(g,g),t=new a.WebGLRenderTarget(g,g);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new a.PlaneGeometry(h,d).rotateX(Math.PI/2),n=new a.Mesh(r),i=new a.MeshDepthMaterial;i.depthTest=i.depthWrite=!1,i.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new a.Color(D)}},e.fragmentShader=e.fragmentShader.replace("void main() {","uniform vec3 ucolor;\n           void main() {\n          "),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let s=new a.ShaderMaterial(o),l=new a.ShaderMaterial(u);return l.depthTest=s.depthTest=!1,[e,r,i,n,s,l,t]},[g,h,d,c,D]),F=e=>{C.visible=!0,C.material=E,E.uniforms.tDiffuse.value=S.texture,E.uniforms.h.value=1*e/256,T.setRenderTarget(L),T.render(C,R.current),C.material=P,P.uniforms.tDiffuse.value=L.texture,P.uniforms.v.value=1*e/256,T.setRenderTarget(S),T.render(C,R.current),C.visible=!1},I=0;return(0,s.F)(()=>{R.current&&(f===1/0||I<f)&&(I++,r=w.background,l=w.overrideMaterial,U.current.visible=!1,w.background=null,w.overrideMaterial=A,T.setRenderTarget(S),T.render(w,R.current),F(m),y&&F(.4*m),T.setRenderTarget(null),U.current.visible=!0,w.overrideMaterial=l,w.background=r)}),i.useImperativeHandle(t,()=>U.current,[]),i.createElement("group",(0,n.Z)({"rotation-x":Math.PI/2},b,{ref:U}),i.createElement("mesh",{renderOrder:j,geometry:k,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},i.createElement("meshBasicMaterial",{transparent:!0,map:S.texture,opacity:v,depthWrite:M})),i.createElement("orthographicCamera",{ref:R,args:[-h/2,h/2,d/2,-d/2,p,x]}))})},1675:function(e,t,r){r.d(t,{M:function(){return u}});var n=r(87),i=r(8427),a=r(5369),s=r(9028),o=r(5528);function u(e){let{count:t=800}=e,r=(0,i.useRef)(null),u=(0,i.useMemo)(()=>{let e=new Float32Array(3*t);return(0,s.Qm)(e,{radius:6}),e},[t]);return(0,a.F)((e,t)=>{r.current&&(r.current.rotation.y+=.018*t,r.current.rotation.x+=.006*t)}),(0,n.jsxs)("points",{ref:r,frustumCulled:!1,children:[(0,n.jsx)("bufferGeometry",{children:(0,n.jsx)("bufferAttribute",{attach:"attributes-position",args:[u,3]})}),(0,n.jsx)("pointsMaterial",{size:.022,color:"#c57e5b",transparent:!0,opacity:.3,sizeAttenuation:!0,blending:o.AdditiveBlending,depthWrite:!1})]})}},711:function(e,t,r){r.r(t),r.d(t,{default:function(){return R}});var n=r(87),i=r(5369),a=r(9544),s=r(3189),o=r(8427),u=r(5528);let l=e=>e===Object(e)&&!Array.isArray(e)&&"function"!=typeof e;function c(e,t){let r=(0,i.D)(e=>e.gl),n=(0,i.H)(u.TextureLoader,l(e)?Object.values(e):e);return(0,o.useLayoutEffect)(()=>{null==t||t(n)},[t]),(0,o.useEffect)(()=>{if("initTexture"in r){let e=[];Array.isArray(n)?e=n:n instanceof u.Texture?e=[n]:l(n)&&(e=Object.values(n)),e.forEach(e=>{e instanceof u.Texture&&r.initTexture(e)})}},[r,n]),(0,o.useMemo)(()=>{if(!l(e))return n;{let t={},r=0;for(let i in e)t[i]=n[r++];return t}},[e,n])}c.preload=e=>i.H.preload(u.TextureLoader,e),c.clear=e=>i.H.clear(u.TextureLoader,e);var f=r(7805);let v={height:3.4,halfWidth:1.143,halfDepth:.658,neckRadius:.3,squareness:4.5,bodyTop:.7,shoulderTop:.88,radial:128,rings:160},h=e=>e*e*(3-2*e),d=(e,t,r)=>e+(t-e)*r;function m(e,t,r,n,i){let a=[],s=[],o=e.height,l=-o/2,c=e.radial+1;for(let s=0;s<=e.rings;s++){let u=d(t,r,s/e.rings),c=i(u),f=l+u*o;for(let t=0;t<=e.radial;t++){let[r,i]=function(e,t,r,n){let i=e*Math.PI*2,a=Math.cos(i),s=Math.sin(i),o=2/n;return[t*Math.sign(a)*Math.pow(Math.abs(a),o),r*Math.sign(s)*Math.pow(Math.abs(s),o)]}(t/e.radial,c.ax*n,c.az*n,c.n);a.push(r,f,i)}}for(let t=0;t<e.rings;t++)for(let r=0;r<e.radial;r++){let e=t*c+r,n=e+c;s.push(e,n,e+1,e+1,n,n+1)}let f=a.length/3;a.push(0,l+t*o,0);for(let t=0;t<e.radial;t++)s.push(f,t+1,t);let v=e.rings*c,h=a.length/3;a.push(0,l+r*o,0);for(let t=0;t<e.radial;t++)s.push(h,v+t,v+t+1);let m=new u.BufferGeometry;return m.setAttribute("position",new u.Float32BufferAttribute(a,3)),m.setIndex(s),m.computeVertexNormals(),m}let p=v.halfDepth,x=v.height/2;function g(){let e=(0,o.useRef)(null),t=(0,o.useRef)(!1),r=(0,o.useRef)(0),a=(0,o.useRef)(0),s=(0,o.useMemo)(()=>(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v;return m(e,0,1,1,t=>(function(e,t){if(e<=t.bodyTop)return{ax:t.halfWidth,az:t.halfDepth,n:t.squareness};if(e>=t.shoulderTop){let r=t.neckRadius;return e>.95&&(r=t.neckRadius*(1+.13*Math.sin((e-.95)/.050000000000000044*Math.PI))),{ax:r,az:r,n:2}}let r=h((e-t.bodyTop)/(t.shoulderTop-t.bodyTop));return{ax:d(t.halfWidth,t.neckRadius,r),az:d(t.halfDepth,t.neckRadius,r),n:d(t.squareness,2,r)}})(t,e))})(v),[]),l=(0,o.useMemo)(()=>(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.66,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.9;return m(e,.012,t,r,()=>({ax:e.halfWidth,az:e.halfDepth,n:e.squareness}))})({...v,rings:30},.66,.94),[]),g=c("/bottle/label.png");g.colorSpace=u.SRGBColorSpace,g.anisotropy=8;let y=(0,o.useMemo)(()=>(function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("undefined"==typeof document)return null;let{width:r=512,height:n=256,fontCss:i='600 92px Georgia, "Times New Roman", serif'}=t,a=document.createElement("canvas");a.width=r,a.height=n;let s=a.getContext("2d");if(!s)return null;s.fillStyle="#808080",s.fillRect(0,0,r,n),s.fillStyle="#000000",s.font=i,s.textAlign="center",s.textBaseline="middle",s.fillText(e,r/2,n/2+4);let o=new u.CanvasTexture(a);return o.colorSpace=u.NoColorSpace,o.anisotropy=4,o.minFilter=u.LinearFilter,o.magFilter=u.LinearFilter,o})("47.4486\xb0 N \xb7 12.3936\xb0 E",{width:768,height:160,fontCss:"500 56px Georgia, serif"}),[]);return(0,i.F)((n,i)=>{let s=e.current;if(!s)return;let o=n.clock.elapsedTime,u=Math.min(i,.05),l=t.current?.9:0;a.current+=(l-a.current)*Math.min(1,3*u),r.current+=a.current*u;let c=.3*(1-Math.min(1,a.current/.9));s.rotation.y=r.current+Math.sin(.18*o)*c,s.position.y=0+.035*Math.sin(o*Math.PI*.36)}),(0,n.jsxs)("group",{ref:e,position:[0,0,0],children:[(0,n.jsxs)("mesh",{onPointerOver:()=>t.current=!0,onPointerOut:()=>t.current=!1,children:[(0,n.jsx)("boxGeometry",{args:[2.5,3.7,1.6]}),(0,n.jsx)("meshBasicMaterial",{transparent:!0,opacity:0,depthWrite:!1})]}),(0,n.jsx)("mesh",{geometry:l,children:(0,n.jsx)("meshPhysicalMaterial",{color:"#0a130c",roughness:.5,metalness:0})}),(0,n.jsx)("mesh",{geometry:s,children:(0,n.jsx)(f.z,{transmission:1,ior:1.5,thickness:1,roughness:.05,chromaticAberration:.01,distortion:0,temporalDistortion:0,color:"#0d1410",attenuationColor:"#070d08",attenuationDistance:.9,backside:!1,samples:6,resolution:256})}),(0,n.jsxs)("mesh",{position:[0,.16,p+.012],children:[(0,n.jsx)("planeGeometry",{args:[.9,1.42]}),(0,n.jsx)("meshStandardMaterial",{map:g,emissiveMap:g,emissive:"#ffffff",emissiveIntensity:.22,roughness:.62,metalness:0})]}),(0,n.jsxs)("mesh",{position:[0,-x-.004,0],rotation:[Math.PI/2,0,0],children:[(0,n.jsx)("planeGeometry",{args:[1.7,.62]}),(0,n.jsx)("meshStandardMaterial",{color:"#0c130d",roughness:.7,metalness:.2,side:u.DoubleSide,bumpMap:null!=y?y:void 0,bumpScale:.4,transparent:!0,opacity:.85})]})]})}function y(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("directionalLight",{position:[-4,5,3],intensity:3,color:"#fff1d6"}),(0,n.jsx)("spotLight",{position:[5,1.5,3.5],angle:.9,penumbra:1,decay:0,intensity:.9,color:"#3a2818"}),(0,n.jsx)("spotLight",{position:[0,2.5,-5],angle:.45,penumbra:.6,decay:0,intensity:1.8,color:"#c57e5b"}),(0,n.jsx)("ambientLight",{intensity:.18}),(0,n.jsx)("pointLight",{position:[.6,-.2,4.5],intensity:.5,decay:0,color:"#ffe9c8"})]})}var D=r(5733),M=r(4697);function j(){return(0,n.jsxs)(D.qA,{resolution:256,frames:1,background:!1,children:[(0,n.jsx)("color",{attach:"background",args:["#060606"]}),(0,n.jsx)(M.D,{form:"rect",intensity:2.2,color:"#fff1d6",position:[-6,5,1],scale:[15,15,1],target:[0,0,0]}),(0,n.jsx)(M.D,{form:"rect",intensity:1.1,color:"#cdbb9a",position:[7,0,3],scale:[12,12,1],target:[0,0,0]}),(0,n.jsx)(M.D,{form:"rect",intensity:1.4,color:"#c57e5b",position:[0,2,-7],scale:[11,9,1],target:[0,0,0]}),(0,n.jsx)(M.D,{form:"rect",intensity:.7,color:"#e8e2d2",position:[0,9,0],rotation:[Math.PI/2,0,0],scale:[9,9,1],target:[0,0,0]})]})}var b=r(1675),U=r(1412);function w(e){let{onReady:t}=e;return(0,o.useEffect)(()=>{null==t||t()},[t]),null}function T(){let{camera:e,size:t}=(0,i.D)();return(0,o.useEffect)(()=>{let r=t.width/Math.max(1,t.height);e.position.set(0,0,r>=1?7.3:7.3*(1+(1-r))),e.updateProjectionMatrix()},[e,t]),null}function R(e){let{onReady:t,active:r=!0}=e;return(0,n.jsxs)(a.Xz,{flat:!0,shadows:!0,frameloop:r?"always":"never",dpr:[1,1.5],camera:{position:[0,0,7.3],fov:35},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1},children:[(0,n.jsx)(T,{}),(0,n.jsx)(y,{}),(0,n.jsxs)(o.Suspense,{fallback:null,children:[(0,n.jsx)(j,{}),(0,n.jsx)(g,{}),(0,n.jsx)(s.j,{position:[0,-1.78,0],opacity:.45,blur:2.4,scale:6,far:4,resolution:512,color:"#04140a"}),(0,n.jsx)(b.M,{count:500}),(0,n.jsx)(w,{onReady:t})]}),(0,n.jsx)(U.E,{})]})}},1412:function(e,t,r){r.d(t,{E:function(){return h}});var n=r(87),i=r(8427),a=r(9929),s=r(7720),o=r(5240),u=r(9480),l=r(3496),c=r(8285),f=r(7141),v=r(5528);function h(){let e=(0,i.useMemo)(()=>new v.Vector2(8e-4,8e-4),[]);return(0,n.jsxs)(a.x,{multisampling:2,children:[(0,n.jsx)(s.d,{intensity:.45,luminanceThreshold:.7,luminanceSmoothing:.25,mipmapBlur:!0}),(0,n.jsx)(o.l,{mode:f.hm.ACES_FILMIC}),(0,n.jsx)(u.V,{offset:e,radialModulation:!1,modulationOffset:0}),(0,n.jsx)(l.c,{opacity:.04,premultiply:!0,blendFunction:f.YQ.OVERLAY}),(0,n.jsx)(c.s,{darkness:.55,offset:.3})]})}}}]);