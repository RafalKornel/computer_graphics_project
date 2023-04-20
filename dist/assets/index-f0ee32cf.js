var k=Object.defineProperty;var F=(o,e,t)=>e in o?k(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var a=(o,e,t)=>(F(o,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();class q{constructor(){a(this,"framesCount");a(this,"startTime");this.framesCount=0,this.startTime=performance.now(),this.measureFramerate()}incrementFrames(){this.framesCount+=1}get dt(){return performance.now()-this.startTime}get framerate(){return this.framesCount/this.dt*1e3}logFramerate(){const e=this.dt/1e3;console.log(`Avg framerate: ${this.framerate.toFixed(2)} | frames: ${this.framesCount} | t: ${e.toFixed()} `)}measureFramerate(){setInterval(()=>this.logFramerate(),1e3)}}class B{constructor(e,t,i={}){a(this,"_bufferWidth",4);a(this,"ctx");a(this,"raf");a(this,"width");a(this,"height");a(this,"buffer");a(this,"framerateCounter");const{height:r=640,width:s=640,logFramerate:n=!1}=i;n&&(this.framerateCounter=new q),this.height=r,this.width=s,e.width=this.width,e.height=this.height;const c=e.getContext("2d");if(!c)throw new Error("Your browser doesn't support canvas");this.ctx=c,this.buffer=new Uint8ClampedArray(this.width*this.height*this._bufferWidth),t&&this.registerControlButton(t)}start(){this.loopWrapper()}loopWrapper(){var e;(e=this.framerateCounter)==null||e.incrementFrames(),this.loop(),this.draw(),this.raf=requestAnimationFrame(()=>this.loopWrapper())}draw(){this.ctx.clearRect(0,0,this.width,this.height);const e=new ImageData(this.buffer,this.width,this.height);this.ctx.putImageData(e,0,0)}registerControlButton(e){e.innerHTML="pause",e.addEventListener("click",()=>{this.raf?(cancelAnimationFrame(this.raf),this.raf=void 0,e.innerHTML="start"):(this.start(),e.innerHTML="pause")})}}class m{constructor(e){a(this,"_matrix");a(this,"_rank");this._matrix=e,this._rank=e.length}get matrix(){return this._matrix}get rank(){return this._rank}multiplyVec(e){if(this._rank!==e.length)throw new Error("Matrix and vector does not align");let t=[];for(let i of this._matrix){let r=0;for(let s=0;s<e.length;s++){const n=i[s],c=e[s];r+=n*c}t.push(r)}return t}transpose(){const e=this._rank,t=this._rank,i=[];for(let r=0;r<t;r++){i[r]=[];for(let s=0;s<e;s++)i[r][s]=0}for(let r=0;r<e;r++)for(let s=0;s<t;s++)i[s][r]=this._matrix[r][s];this._matrix=i}multiplyMatrix(e){if(e.rank!==this._rank)throw new Error("Matrices does not align");let t=[];for(let r=0;r<e.rank;r++){let s=[];for(let n=0;n<e.rank;n++){let c=0;for(let l=0;l<e.rank;l++)c+=this._matrix[n][l]*e.matrix[l][r];s.push(c)}t.push(s)}const i=new m(t);return i.transpose(),i}}const L=o=>o,T=([o,e,t],i)=>[o*i,e*i,t*i],R=(o,e)=>Math.sqrt((o[0]-e[0])**2+(o[1]-e[1])**2+(o[2]-e[2])**2);class p{constructor(e,t,i){a(this,"_x");a(this,"_y");a(this,"_z");a(this,"matrix");this._x=L(e),this._y=L(t),this._z=L(i),this.matrix=new m([this._x,this._y,this._z])}get x(){return this._x}get y(){return this._y}get z(){return this._z}static fromMatrix(e){return new p(e.matrix[0],e.matrix[1],e.matrix[2])}}const H=o=>new m([[Math.cos(o),0,Math.sin(o)],[0,1,0],[-Math.sin(o),0,Math.cos(o)]]),j=o=>new m([[1,0,0],[0,Math.cos(o),-Math.sin(o)],[0,Math.sin(o),Math.cos(o)]]),$=o=>new m([[Math.cos(o),-Math.sin(o),0],[Math.sin(o),Math.cos(o),0],[0,0,1]]),U={x:j,y:H,z:$};class N{constructor({mesh:e,localCoordinateSystem:t=new p([1,0,0],[0,1,0],[0,0,1]),position:i=[0,0,0]}={}){a(this,"_position");a(this,"_localCoordinateSystem");a(this,"_mesh");a(this,"_toLocalTransformMatrix");a(this,"_toWorldTransformMatrix");this._position=i,this._localCoordinateSystem=t,this._mesh=e,this._toLocalTransformMatrix=this.calculateToLocalTransformMatrix(),this._toWorldTransformMatrix=this.calculateToWorldTransformMatrix()}get position(){return this._position}get localCoordinateSystem(){return this._localCoordinateSystem}get mesh(){return this._mesh}transformVecToLocalSystem([e,t,i]){const[r,s,n]=this._toLocalTransformMatrix.multiplyVec([e,t,i,1]);return[r,s,n]}transformVecToWorldSystem([e,t,i]){const[r,s,n]=this._toWorldTransformMatrix.multiplyVec([e,t,i,1]);return[r,s,n]}move([e,t,i]){const[r,s,n]=this._position;this._position=[r+e,s+t,n+i],this.recalculateToLocalTransformMatrix(),this.recalculateToWorldTransformMatrix()}rotate(e,t){const i=U[e](t);this._localCoordinateSystem=p.fromMatrix(i.multiplyMatrix(this._localCoordinateSystem.matrix)),this.recalculateToWorldTransformMatrix(),this.recalculateToLocalTransformMatrix()}calculateToLocalTransformMatrix(){const e=this.localCoordinateSystem.x,t=this.localCoordinateSystem.y,i=this.localCoordinateSystem.z,r=new m([[-e[0],-e[1],-e[2],0],[-t[0],-t[1],-t[2],0],[-i[0],-i[1],-i[2],0],[0,0,0,1]]),s=this.position[0],n=this.position[1],c=this.position[2],l=new m([[1,0,0,s],[0,1,0,n],[0,0,1,c],[0,0,0,1]]);return r.multiplyMatrix(l)}recalculateToLocalTransformMatrix(){this._toLocalTransformMatrix=this.calculateToLocalTransformMatrix()}calculateToWorldTransformMatrix(){const e=this.localCoordinateSystem.x,t=this.localCoordinateSystem.y,i=this.localCoordinateSystem.z;return new m([[e[0],t[0],i[0],-this.position[0]],[e[1],t[1],i[1],-this.position[1]],[e[2],t[2],i[2],-this.position[2]],[0,0,0,1]])}recalculateToWorldTransformMatrix(){this._toWorldTransformMatrix=this.calculateToWorldTransformMatrix()}}class G extends N{constructor(t){super(t);a(this,"TRANSLATION_INTERVAL",.1);a(this,"ROTATION_INTERVAL",.1);a(this,"handleTranslation",t=>{const i=this.localCoordinateSystem.z,r=this.localCoordinateSystem.x;t==="w"&&this.move(T(i,this.TRANSLATION_INTERVAL)),t==="s"&&this.move(T(i,-this.TRANSLATION_INTERVAL)),t==="a"&&this.move(T(r,-this.TRANSLATION_INTERVAL)),t==="d"&&this.move(T(r,this.TRANSLATION_INTERVAL))});this.registerMovement()}registerMovement(){document.addEventListener("keydown",t=>{this.handleTranslation(t.key),this.handleHorizontalRotation(t.key),this.handleVerticalRotation(t.key),this.handleClockRotation(t.key)})}handleHorizontalRotation(t){t==="ArrowLeft"&&this.rotate("y",this.ROTATION_INTERVAL),t==="ArrowRight"&&this.rotate("y",-this.ROTATION_INTERVAL)}handleVerticalRotation(t){t==="ArrowUp"&&this.rotate("x",-this.ROTATION_INTERVAL),t==="ArrowDown"&&this.rotate("x",this.ROTATION_INTERVAL)}handleClockRotation(t){t==="e"&&this.rotate("z",-this.ROTATION_INTERVAL),t==="q"&&this.rotate("z",this.ROTATION_INTERVAL)}}class X{constructor(e,t,i){a(this,"_vertices");a(this,"_triangleIndices");a(this,"color");a(this,"rastrizedVertices");this._vertices=e,this._triangleIndices=t,this.color=i,this.rastrizedVertices=[]}get vertices(){return this._vertices}get triangleIndices(){return this._triangleIndices}}class I extends N{constructor({dimension:e,color:t,position:i=[0,0,0]}){const r=-e/2,s=+e/2,n=-e/2,c=+e/2,l=-e/2,h=+e/2,d=[[r,n,l],[r,c,l],[r,c,h],[r,n,h],[s,n,h],[s,c,h],[s,c,l],[s,n,l]],u=[[0,3,2],[2,1,0],[2,5,6],[6,1,2],[7,6,5],[5,4,7],[0,7,4],[3,0,4],[2,3,4],[4,5,2],[0,6,7],[0,1,6]],f=new X(d,u,t);super({mesh:f,position:i})}}class Y{constructor(){a(this,"objects");a(this,"coordinateSystem");this.objects=[],this.coordinateSystem=new p([1,0,0],[0,1,0],[0,0,1])}addObject(e){this.objects.push(e)}addObjects(e){e.forEach(t=>this.addObject(t))}}function b([o,e],[t,i]){let r=[];const s=t-o,n=i-e;if(s==0)return[];const c=n/s,l=s>0?o:t,h=s>0?t:o;let u=s>0?e:i;for(let f=l;f<=h;f++)u=u+c,r.push([f,Math.round(u)]);return r}class K extends G{constructor({buffer:t,bufferWidth:i,height:r,width:s,focalDistance:n,coneLowerDist:c=0,coneUpperDist:l=100,localCoordinateSystem:h,position:d=[0,0,-5]}){super({localCoordinateSystem:h,position:d});a(this,"_bufferWidth");a(this,"_buffer");a(this,"_width");a(this,"_height");a(this,"_aspectRatio");a(this,"_focalDistance");a(this,"_coneLowerDist");a(this,"_coneUpperDist");a(this,"_withPainterAlgorithm");this._buffer=t,this._bufferWidth=i,this._width=s,this._height=r,this._aspectRatio=s/r,this._focalDistance=n,this._coneLowerDist=c,this._coneUpperDist=l,this._withPainterAlgorithm=!0}changeFocalDistance(t){this._focalDistance=t}togglePainterAlgorithm(){this._withPainterAlgorithm=!this._withPainterAlgorithm}renderScene(t){for(let r=0;r<this._buffer.length;r++)this._buffer[r]=0;(this._withPainterAlgorithm?this.painterAlgorithmSort(t.objects):t.objects).forEach(r=>{if(!r.mesh)return;const s=r.mesh.vertices.map(n=>{const c=r.transformVecToWorldSystem(n),l=this.transformVecToLocalSystem(c);if(!(this._coneLowerDist<l[2]&&l[2]<this._coneUpperDist))return null;const d=this.transformCameraToPlaneCoors(l),u=this.rastrize(d);return this.setPixel(u,r.mesh.color),u});r.mesh.rastrizedVertices=s,r.mesh.triangleIndices.forEach((n,c)=>{[0,1,2].forEach(l=>{const h=n[l],d=n[(l+1)%3],u=s[h],f=s[d];!u||!f||this.fillTriangle(r.mesh,c)})})})}fillTriangle(t,i){const r=t.triangleIndices[i],s=t.rastrizedVertices[r[0]],n=t.rastrizedVertices[r[1]],c=t.rastrizedVertices[r[2]];if(!s||!n||!c)return;let l=[s,n,c].sort((_,x)=>_[1]-x[1]),[h,d,u]=l,f=b([h[1],h[0]],[d[1],d[0]]),V=b([d[1],d[0]],[u[1],u[0]]),g=b([h[1],h[0]],[u[1],u[0]]);f.pop();const w=[...f,...V];let y,M;const C=Math.floor(g.length/2);g[C]<w[C]?(y=g,M=w):(y=w,M=g);const A=l[0][1],O=l[2][1];for(let _=A;_<O;_++){let x=y[_-A],S=M[_-A];const z=Math.min(x[1],S[1]),E=Math.max(x[1],S[1]),[W,P,D]=t.color;for(let v=z;v<E;v++)this.setPixel([v,_],[W,P,D])}}painterAlgorithmSort(t){return[...t].sort((i,r)=>{const s=R(this.position,i.position);return R(this.position,r.position)-s})}transformCameraToPlaneCoors([t,i,r]){const s=t*this._focalDistance/(r+this._focalDistance),n=i*this._focalDistance/(r+this._focalDistance);return[s,n]}rastrize([t,i]){const r=Math.floor((t+1)/this._aspectRatio/2*this._width),s=Math.floor((i+1)/2*this._height);return[r,s]}getBufferPosition(t,i){const s=i*this._width*this._bufferWidth+t*this._bufferWidth;return i<this._height&&t<this._width&&t>=0&&i>=0?s:null}setPixel([t,i],r){const s=this.getBufferPosition(t,i);if(!s)return;const[n,c,l]=r;this._buffer[s+0]=n,this._buffer[s+1]=c,this._buffer[s+2]=l,this._buffer[s+3]=255}}const Z=Math.PI/4,J=new p([1,0,0],[0,1,0],[0,0,1]);class Q extends B{constructor({canvas:t,controlButton:i,sliderInput:r,painterAlgCheckbox:s}){super(t,i,{height:800,width:800,logFramerate:!1});a(this,"_scene");a(this,"_camera");const n=[new I({dimension:1,color:[200,0,0],position:[2,.6,2]}),new I({dimension:1,color:[0,200,0],position:[2,.5,4]}),new I({dimension:2,color:[0,0,200],position:[-2,0,3]})],c=new Y;c.addObjects(n),this._scene=c,this._camera=new K({buffer:this.buffer,bufferWidth:this._bufferWidth,width:this.width,height:this.height,focalDistance:1,position:[0,0,-1],localCoordinateSystem:J}),r&&this.registerSliderInput(r),s&&this.registerPainterAlgCheckbox(s)}loop(){this._scene.objects.forEach((t,i)=>{const r=["x","y","z"][i&3];t.rotate(r,Z/100)}),this._camera.renderScene(this._scene)}registerSliderInput(t){t.addEventListener("input",i=>{const r=Number(i.target.value);this._camera.changeFocalDistance(r)})}registerPainterAlgCheckbox(t){t.addEventListener("change",()=>{this._camera.togglePainterAlgorithm()})}}const tt=o=>{let e=1;o.innerHTML=`
  <label for="focal">Focal distance: <span id="slider-value">${e}</span></label>
  <input value=${e}  name="focal" type="range" min="0.1" max="3" step="0.1" style="width: 100%"></input>
`;const t=document.querySelector("input[name=focal]"),i=document.querySelector("span#slider-value");return t.addEventListener("input",r=>{const s=r.target.value;i.innerHTML=s,e=s}),t},et=`
<h2>Controls:</h2>

<div class="legend">
  <div>
    <h3>Translation</h3>
    <ul>
      <li>Forward: <strong>w</strong></li>
      <li>Backward: <strong>s</strong></li>
      <li>Left: <strong>a</strong></li>
      <li>Right: <strong>d</strong></li>
    </ul>
  </div>

  <div>
    <h3>Vertical rotation</h3>
    <ul>
      <li>Up: <strong>↑</strong></li>
      <li>Down: <strong>↓</strong></li>
    </ul>
  </div>

  <div>
    <h3>Horizontal rotation</h3>
    <ul>
      <li>Left: <strong>←</strong></li>
      <li>Right: <strong>→</strong></li>
    </ul>
  </div>

  <div>
    <h3>Screw rotation</h3>
    <ul>
      <li>Clockwise: <strong>e</strong></li>
      <li>Counter clockwise: <strong>q</strong></li>
    </ul>
  </div>
</div>
`,rt=`
<div class="controls">
  ${et}

  <div id="slider-wrapper" style="width: 100%"></div>

  <button id="control"></button>

  <label for="painter-alg-checkbox">
    <input id="painter-alg-checkbox" type="checkbox" checked="true"></input>
    Painter algorithm
  </label>

</div>`;document.querySelector("#app").innerHTML=`
    ${rt}
    <div>


      <canvas></canvas>

    </div>
`;const st=tt(document.querySelector("#slider-wrapper")),it=new Q({canvas:document.querySelector("canvas"),controlButton:document.querySelector("button#control"),painterAlgCheckbox:document.querySelector("input#painter-alg-checkbox"),sliderInput:st});it.start();