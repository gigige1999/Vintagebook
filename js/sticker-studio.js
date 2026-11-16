import { connectedBackground, connectedRegion, fillRegionHoles, keepOnlyRegion, colorPixels } from './sticker-pixels.js';
import { importImage, loadAsset, saveAsset, imageFrom, toBlob } from './asset-store.js';
import { applyShell, shellInfo, STICKER_SHELLS } from './sticker-frames.js';
const defaults={crop:{x:0,y:0,w:1,h:1},filter:'original',shape:'none',shell:'none',outlineStyle:'sticker',brightness:100,contrast:100,saturation:100,outline:0};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const copy=o=>JSON.parse(JSON.stringify(o));
function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
export function mountStickerStudio({onCommit,notify}) {
  const dialog=document.querySelector('#sticker-dialog'),editor=document.querySelector('#cutout-canvas'),result=document.querySelector('#sticker-result');
  const input=document.querySelector('#sticker-input'),controls=document.querySelector('#sticker-adjustments');
  const layout=dialog.querySelector('.sticker-layout'),steps=dialog.querySelector('.studio-steps');
  let source=null,alpha=null,config=copy(defaults),target=null,sourceId=null,tool='crop',wandMode='keep',history=[],pointer=null,session=0,renderTimer,output=null,loading=false,alphaId=null;
  const $=s=>dialog.querySelector(s);
  function status(text){$('#sticker-status').textContent=text;}
  function goStep(step,name){
    layout.dataset.step=step;
    steps.querySelectorAll('[data-step]').forEach(button=>{const active=button.dataset.step===step;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
    if(name)status(name);
    if(!window.matchMedia('(max-width:700px)').matches)return;
    const column=layout.querySelector(step==='cut'?'.sticker-editor-column':'.sticker-result-column');
    if(column)column.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function busy(value){loading=value;$('#commit-sticker').disabled=value||!source;$('#choose-sticker-image').disabled=value;$('#sticker-tools').inert=value;$('.cutout-actions').inert=value;$('.cutout-options').inert=value;controls.inert=value;}
  function syncControls(){for(const key of ['filter','shape','shell','outlineStyle','brightness','contrast','saturation','outline']){const el=controls.querySelector(`[data-setting="${key}"]`);if(el)el.value=config[key];}syncOutputs();}
  $('#shell-templates').innerHTML=STICKER_SHELLS.map(shell=>`<option value="${shell.id}">${shell.name}</option>`).join("");
  function syncOutputs(){controls.querySelectorAll('input[type=range]').forEach(input=>{input.nextElementSibling.textContent=input.value+(input.dataset.setting==='outline'?' px':'%');});}
  function snapshot(){history.push({alpha:alpha.getContext('2d').getImageData(0,0,alpha.width,alpha.height),config:copy(config)});if(history.length>5)history.shift();$('#cutout-undo').disabled=false;}
  function drawEditor(){
    if(!source)return;
    const scale=Math.min(1,900/Math.max(source.width,source.height));
    editor.width=Math.max(1,Math.round(source.width*scale));editor.height=Math.max(1,Math.round(source.height*scale));
    const x=editor.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(source,0,0,editor.width,editor.height);x.globalCompositeOperation='destination-in';x.drawImage(alpha,0,0,editor.width,editor.height);x.globalCompositeOperation='source-over';
    const crop=config.crop;x.strokeStyle='#6c855c';x.lineWidth=Math.max(2,editor.width/250);x.setLineDash([editor.width/75,editor.width/100]);x.strokeRect(crop.x*editor.width,crop.y*editor.height,crop.w*editor.width,crop.h*editor.height);
    $('#crop-size').textContent=`${Math.round(crop.w*source.width)} × ${Math.round(crop.h*source.height)} px`;
  }
  function shapePath(x,w,h,shape){
    x.beginPath();
    if(shape==='circle'||shape==='oval'){const r=shape==='circle'?Math.min(w,h)/2:0;x.ellipse(w/2,h/2,r||w/2,r||h/2,0,0,Math.PI*2);}
    else if(shape==='rounded'){const r=Math.min(w,h)*.11;x.moveTo(r,0);x.lineTo(w-r,0);x.quadraticCurveTo(w,0,w,r);x.lineTo(w,h-r);x.quadraticCurveTo(w,h,w-r,h);x.lineTo(r,h);x.quadraticCurveTo(0,h,0,h-r);x.lineTo(0,r);x.quadraticCurveTo(0,0,r,0);}
    else if(shape==='squircle'){const r=Math.min(w,h)*.3;x.moveTo(r,0);x.lineTo(w-r,0);x.bezierCurveTo(w-r*.35,0,w,0,w,r);x.lineTo(w,h-r);x.bezierCurveTo(w,h,w,h-r*.35,w-r,h);x.lineTo(r,h);x.bezierCurveTo(r*.35,h,0,h,0,h-r);x.lineTo(0,r);x.bezierCurveTo(0,r*.35,r*.35,0,r,0);}
    else if(shape==='capsule'){const r=Math.min(w,h)/2;x.moveTo(r,0);x.lineTo(w-r,0);x.quadraticCurveTo(w,0,w,r);x.lineTo(w,h-r);x.quadraticCurveTo(w,h,w-r,h);x.lineTo(r,h);x.quadraticCurveTo(0,h,0,h-r);x.lineTo(0,r);x.quadraticCurveTo(0,0,r,0);}
    else if(shape==='arch'){const rise=Math.min(w/2,h*.6);x.moveTo(0,h);x.lineTo(0,rise);x.bezierCurveTo(0,-rise/3,w,-rise/3,w,rise);x.lineTo(w,h);}
    else if(shape==='dome'){const r=Math.min(h*.9,w*.62);x.moveTo(0,h);x.lineTo(0,h-r);x.ellipse(w/2,h-r,w/2,r,0,Math.PI,0);x.lineTo(w,h);}
    else if(shape==='heart'){x.moveTo(w/2,h*.95);x.bezierCurveTo(-w*.3,h*.45,w*.03,-h*.2,w/2,h*.25);x.bezierCurveTo(w*.97,-h*.2,w*1.3,h*.45,w/2,h*.95);}
    else if(shape==='flower'){const cx=w/2,cy=h/2,R=Math.min(w,h)/2*.98;for(let i=0;i<=180;i++){const t=i/180*Math.PI*2,r=R*(.84+.16*Math.cos(8*t)),px=cx+Math.cos(t)*r,py=cy+Math.sin(t)*r;i?x.lineTo(px,py):x.moveTo(px,py);}}
    else if(shape==='star'){const cx=w/2,cy=h/2,R=Math.min(w,h)/2*.99,inner=R*.46;for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?inner:R,px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;i?x.lineTo(px,py):x.moveTo(px,py);}}
    else if(shape==='hex'){const cx=w/2,cy=h/2;[[0,-1],[.866,-.5],[.866,.5],[0,1],[-.866,.5],[-.866,-.5]].forEach(([ax,ay],i)=>{const px=cx+ax*w/2*.99,py=cy+ay*h/2*.99;i?x.lineTo(px,py):x.moveTo(px,py);});}
    else if(shape==='triangle'){x.moveTo(w/2,0);x.lineTo(w,h);x.lineTo(0,h);}
    else if(shape==='drop'){const cy=h*.66,r=Math.min(w/2,h*.34);x.moveTo(w/2,0);x.quadraticCurveTo(w*.52+r,w*.0+cy*.55,w/2+r,cy);x.arc(w/2,cy,r,0,Math.PI);x.quadraticCurveTo(w*.48-r,cy*.55,w/2,0);}
    else if(shape==='bookmark'){const notch=h*.16;x.moveTo(0,0);x.lineTo(w,0);x.lineTo(w,h);x.lineTo(w/2,h-notch);x.lineTo(0,h);}
    else if(shape==='pennant'){x.moveTo(0,0);x.lineTo(w*.78,0);x.lineTo(w,h/2);x.lineTo(w*.78,h);x.lineTo(0,h);}
    else if(shape==='ticket'){const r=Math.min(w,h)*.1;x.moveTo(0,0);x.lineTo(w,0);x.lineTo(w,h/2-r);x.arc(w,h/2,r,Math.PI*1.5,Math.PI*.5,true);x.lineTo(w,h);x.lineTo(0,h);x.lineTo(0,h/2+r);x.arc(0,h/2,r,Math.PI*.5,Math.PI*1.5,true);}
    else if(shape==='wave'){const amp=Math.min(h*.07,w*.04),n=6,step=w/n;x.moveTo(0,amp);for(let i=0;i<n;i++)x.quadraticCurveTo(step*(i+.5),-amp*(i%2?1:0.15),step*(i+1),amp);x.lineTo(w,h-amp);for(let i=n;i>0;i--)x.quadraticCurveTo(step*(i-.5),h+amp*(i%2?1:0.15),step*(i-1),h-amp);}
    else if(shape==='bubble'){const r=Math.min(w,h)*.22,tail=w*.16;x.moveTo(r,0);x.lineTo(w-r,0);x.quadraticCurveTo(w,0,w,r);x.lineTo(w,h*.72);x.quadraticCurveTo(w,h*.72+r,w-r,h*.72+r);x.lineTo(w*.42,h*.72+r);x.lineTo(w*.3,h);x.lineTo(w*.34,h*.72+r);x.lineTo(r,h*.72+r);x.quadraticCurveTo(0,h*.72+r,0,h*.72);x.lineTo(0,r);x.quadraticCurveTo(0,0,r,0);}
    else if(shape==='torn'){const step=w/22;for(let i=0;i<=22;i++)x.lineTo(i*step,(i%3)*h*.012);x.lineTo(w,h);for(let i=22;i>=0;i--)x.lineTo(i*step,h-(i%4)*h*.011);}
    else x.rect(0,0,w,h);
    x.closePath();
  }
  async function produce(maxSide=Infinity){
    const crop=config.crop,sx=Math.min(source.width-1,Math.round(crop.x*source.width)),sy=Math.min(source.height-1,Math.round(crop.y*source.height)),sw=Math.max(1,Math.min(source.width-sx,Math.round(crop.w*source.width))),sh=Math.max(1,Math.min(source.height-sy,Math.round(crop.h*source.height)));
    const scale=Math.min(1,maxSide/Math.max(sw,sh)),w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
    const c=makeCanvas(w,h),x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';
    x.drawImage(source,sx,sy,sw,sh,0,0,w,h);x.globalCompositeOperation='destination-in';x.drawImage(alpha,sx,sy,sw,sh,0,0,w,h);x.globalCompositeOperation='source-over';
    const pixels=x.getImageData(0,0,w,h);colorPixels(pixels.data,config.filter,Number(config.brightness),Number(config.contrast),Number(config.saturation));x.putImageData(pixels,0,0);
    if(config.shape!=='none'){const mask=makeCanvas(w,h),mx=mask.getContext('2d');shapePath(mx,w,h,config.shape);mx.fillStyle='#fff';mx.fill();x.globalCompositeOperation='destination-in';x.drawImage(mask,0,0);x.globalCompositeOperation='source-over';}
    const shellId=config.shell&&config.shell!=='none'?config.shell:null,finish=canvas=>shellId?applyShell(canvas,shellId,maxSide===Infinity?1600:maxSide):canvas;
    const outlineWidth=Number(config.outline),style=config.outlineStyle||'solid';
    if(!outlineWidth||style==='none')return finish(c);
    const border=outlineWidth*Math.max(w,h)/700;
    const pad=Math.ceil(border*2.4)+6,final=makeCanvas(w+pad*2,h+pad*2),fx=final.getContext('2d');
    const color=$('#sticker-border-color').value||'#fff8e8';
    const spread=(radius,fill)=>{const tmp=makeCanvas(final.width,final.height),tx=tmp.getContext('2d');for(let i=0;i<36;i++){const a=i*Math.PI/18;tx.drawImage(c,pad+Math.cos(a)*radius,pad+Math.sin(a)*radius);}tx.globalCompositeOperation='source-in';tx.fillStyle=fill;tx.fillRect(0,0,tmp.width,tmp.height);return tmp;};
    if(style==='glow'){fx.save();fx.shadowColor=color;fx.shadowBlur=border*2.6;fx.drawImage(c,pad,pad);fx.restore();fx.drawImage(spread(border*.4,color),0,0);}
    else if(style==='shadow'){fx.save();fx.globalAlpha=.38;fx.translate(border*.42,border*.5);fx.drawImage(spread(border*1.05,'#3b3126'),0,0);fx.restore();fx.drawImage(spread(border*.42,color),0,0);}
    else if(style==='dashed'){const ring=spread(border,color),rx=ring.getContext('2d'),tile=makeCanvas(30,30),tc=tile.getContext('2d');tc.fillStyle='#fff';tc.fillRect(0,0,17,30);rx.globalCompositeOperation='destination-in';rx.fillStyle=rx.createPattern(tile,'repeat');rx.fillRect(0,0,ring.width,ring.height);fx.drawImage(ring,0,0);}
    else if(style==='double'){fx.drawImage(spread(border,color),0,0);fx.drawImage(spread(border*.74,'#fbf4e4'),0,0);}
    else if(style==='sticker'){fx.drawImage(spread(border*1.06,color),0,0);fx.drawImage(spread(border*.86,'#fdfaf1'),0,0);}
    else if(style==='gilded'){fx.drawImage(spread(border*1.3,'#71512e'),0,0);fx.drawImage(spread(border*1.05,'#b4955e'),0,0);fx.drawImage(spread(border*.68,'#f0d9a4'),0,0);}
    else if(style==='pearl'){fx.drawImage(spread(border*1.26,'#b7a4ad'),0,0);fx.drawImage(spread(border,'#f7e9e0'),0,0);fx.drawImage(spread(border*.58,'#fffdf1'),0,0);}
    else if(style==='ink'){fx.drawImage(spread(border*1.12,'#4c3e35'),0,0);fx.drawImage(spread(border*.73,'#e8d9bd'),0,0);}
    else fx.drawImage(spread(border,color),0,0);
    fx.drawImage(c,pad,pad);
    return finish(final);
  }
  async function render(){
    if(!source)return;const ticket=session;output=await produce(500);if(ticket!==session||!source)return;
    result.width=output.width;result.height=output.height;const x=result.getContext('2d');x.clearRect(0,0,result.width,result.height);x.drawImage(output,0,0);
    const shell=shellInfo(config.shell);
    status(`${shell.art?`${shell.name} · `:""}透明 PNG · ${output.width} × ${output.height} px · 保存时使用高清原图`);
  }
  function schedule(){clearTimeout(renderTimer);renderTimer=setTimeout(()=>{render().catch(()=>{});},100);}
  function point(event){const r=editor.getBoundingClientRect();return{x:clamp((event.clientX-r.left)/r.width,0,1),y:clamp((event.clientY-r.top)/r.height,0,1)};}
  function brush(a,b){const x=alpha.getContext('2d');x.globalCompositeOperation=tool==='erase'?'destination-out':'source-over';x.strokeStyle='#fff';x.fillStyle='#fff';x.lineWidth=Number($('#cutout-brush').value)*source.width/500;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(a.x*source.width,a.y*source.height);x.lineTo(b.x*source.width,b.y*source.height);x.stroke();x.beginPath();x.arc(b.x*source.width,b.y*source.height,x.lineWidth/2,0,Math.PI*2);x.fill();x.globalCompositeOperation='source-over';}
  function remove(seed=null){
    snapshot();const tolerance=Number($('#cutout-tolerance').value),pixels=source.getContext('2d',{willReadFrequently:true}).getImageData(0,0,source.width,source.height);
    const keep=wandMode==='keep'&&seed;
    const selected=keep?connectedRegion(pixels.data,source.width,source.height,tolerance,seed):null;
    const maskData=keep?fillRegionHoles(selected,source.width,source.height):connectedBackground(pixels.data,source.width,source.height,tolerance,seed);
    const context=alpha.getContext('2d',{willReadFrequently:true}),mask=context.getImageData(0,0,alpha.width,alpha.height);let count=0;
    if(keep){keepOnlyRegion(mask.data,maskData,source.width,source.height);for(let i=0;i<maskData.length;i++)if(!maskData[i])count++;}
    else for(let i=0;i<maskData.length;i++)if(maskData[i]){mask.data[i*4+3]=0;count++;}
    context.putImageData(mask,0,0);drawEditor();
    const message=keep?`已保留选区，并补全对象内部细节；清除了 ${Math.round(count/maskData.length*100)}% 的背景像素。`:`已移除 ${Math.round(count/maskData.length*100)}% 像素；复杂背景请用魔棒和擦除修边。`;
    render().then(()=>status(message)).catch(()=>status(message));
  }
  editor.addEventListener('pointerdown',event=>{
    if(!source||loading||event.button!==0)return;event.preventDefault();const p=point(event);
    if(tool==='wand'){remove({x:Math.min(source.width-1,Math.floor(p.x*source.width)),y:Math.min(source.height-1,Math.floor(p.y*source.height))});return;}
    snapshot();pointer={start:p,last:p};editor.setPointerCapture(event.pointerId);
    if(tool==='erase'||tool==='restore'){brush(p,p);drawEditor();}
  });
  editor.addEventListener('pointermove',event=>{
    if(!pointer)return;const p=point(event);
    if(tool==='crop'){let x=Math.min(pointer.start.x,p.x),y=Math.min(pointer.start.y,p.y);config.crop={x:Math.min(x,.99),y:Math.min(y,.99),w:Math.min(1-x,Math.max(.01,Math.abs(p.x-pointer.start.x))),h:Math.min(1-y,Math.max(.01,Math.abs(p.y-pointer.start.y)))};}
    else brush(pointer.last,p);
    pointer.last=p;drawEditor();
  });
  function end(){if(pointer){pointer=null;drawEditor();render();}}
  editor.addEventListener('pointerup',end);editor.addEventListener('pointercancel',end);
  $('#sticker-tools').onclick=event=>{
    const button=event.target.closest('[data-tool]');if(!button)return;
    const picked=button.dataset.tool;
    if(picked==='wand-keep'||picked==='wand-remove'){tool='wand';wandMode=picked==='wand-keep'?'keep':'remove';}
    else tool=picked;
    $('#sticker-tools').querySelectorAll('[data-tool]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    editor.dataset.tool=tool;
    status(tool==='crop'?'拖出想留下的矩形区域，画面外会自动裁掉。':
      tool==='wand'?(wandMode==='keep'?'点一下要保留的主体，只留下和它相连的部分。':'点一下要去掉的背景，相近颜色的整块会被清掉。'):
      tool==='erase'?'手指涂过的地方变透明，适合修掉残留背景。':'涂回误删的区域，只改蒙版，不动原图。');
  };
  function stepRequest(step){if(step==='deco'&&!source){notify('先选一张图片吧');return;}goStep(step);}
  steps.onclick=event=>{const button=event.target.closest('[data-step]');if(button)stepRequest(button.dataset.step);};
  dialog.addEventListener('click',event=>{const button=event.target.closest('[data-go]');if(button)stepRequest(button.dataset.go);});
  $('#remove-background').onclick=()=>{if(source&&!loading)remove();};
  $('#cutout-undo').onclick=()=>{const previous=history.pop();if(!previous)return;alpha.getContext('2d').putImageData(previous.alpha,0,0);config=previous.config;syncControls();drawEditor();render();$('#cutout-undo').disabled=!history.length;};
  $('#reset-cutout').onclick=()=>{if(!source)return;snapshot();alpha.width=source.width;alpha.height=source.height;alpha.getContext('2d').fillStyle='#fff';alpha.getContext('2d').fillRect(0,0,alpha.width,alpha.height);config=copy(defaults);syncControls();drawEditor();render();};
  $('#reset-crop').onclick=()=>{if(!source)return;snapshot();config.crop=copy(defaults.crop);drawEditor();render();};
  function adjust(event){const key=event.target.dataset.setting;if(!key||loading)return;config[key]=event.target.value;if(key==='outlineStyle'&&config.outlineStyle!=='none'&&!Number(config.outline)){config.outline=6;controls.querySelector('[data-setting="outline"]').value=6;}syncOutputs();schedule();}
  controls.addEventListener('input',adjust);
  controls.addEventListener('change',adjust);
  $('#sticker-border-color').oninput=schedule;
  $('#sticker-border-color').onchange=schedule;
  $('#choose-sticker-image').onclick=()=>input.click();
  input.onchange=async event=>{
    const file=event.target.files[0];event.target.value='';if(!file)return;
    const ticket=++session;busy(true);status('正在读取图片…');
    try{
      const imported=await importImage(file,2048);if(ticket!==session)return;
      source=imported.canvas;sourceId=null;alphaId=null;pointer=null;
      alpha=makeCanvas(source.width,source.height);alpha.getContext('2d').fillStyle='#fff';alpha.getContext('2d').fillRect(0,0,alpha.width,alpha.height);
      config=copy(defaults);history=[];$('#sticker-border-color').value='#fff8e8';$('#cutout-undo').disabled=true;$('#sticker-empty').classList.add('hidden');syncControls();$('#sticker-tools [data-tool="crop"]').click();drawEditor();render();
    }catch(error){notify(error.message);status(error.message);}finally{if(ticket===session)busy(false);}
  };
  $('#commit-sticker').onclick=async()=>{
    if(!source||loading)return;const ticket=session;busy(true);status('正在保存高清贴纸…');
    try{
      clearTimeout(renderTimer);const final=await produce(1600),existingSource=sourceId,targetUid=target,settings={...copy(config),borderColor:$('#sticker-border-color').value};
      const [sourceBlob,alphaBlob,stickerBlob]=await Promise.all([existingSource?null:toBlob(source),toBlob(alpha),toBlob(final)]);
      if(ticket!==session||!dialog.open)return;
      const [original,mask,sticker]=await Promise.all([existingSource||saveAsset(sourceBlob),saveAsset(alphaBlob),saveAsset(stickerBlob)]);
      if(ticket!==session||!dialog.open)return;
      await onCommit({sourceAsset:original,alphaAsset:mask,stickerAsset:sticker,imageW:final.width,imageH:final.height,stickerConfig:settings},targetUid);
      dialog.close();notify('透明贴纸已贴入书页，双击可重新裁剪和调整。');
    }catch(error){if(ticket===session){notify(error.message);status(error.message);}}finally{if(ticket===session)busy(false);}
  };
  dialog.addEventListener('close',()=>{session++;clearTimeout(renderTimer);source=null;alpha=null;output=null;pointer=null;history=[];});
  async function open(item=null){
    session++;const ticket=session;target=item?.uid||null;sourceId=item?.sourceAsset||null;alphaId=item?.alphaAsset||null;config={...copy(defaults),...copy(item?.stickerConfig||{})};history=[];source=null;alpha=null;output=null;pointer=null;$('#sticker-tools [data-tool="crop"]').click();
    editor.width=400;editor.height=320;result.width=300;result.height=250;$('#sticker-empty').classList.remove('hidden');$('#crop-size').textContent='尚未选择图片';$('#cutout-undo').disabled=true;$('#sticker-border-color').value=config.borderColor||'#fff8e8';syncControls();busy(!!item);goStep('cut','第一步：选图并抠掉背景，想好主体再进入装饰。');dialog.showModal();
    if(item){try{const [image,mask]=await Promise.all([imageFrom(await loadAsset(item.sourceAsset)),imageFrom(await loadAsset(item.alphaAsset))]);if(ticket!==session)return;source=makeCanvas(image.naturalWidth,image.naturalHeight);source.getContext('2d').drawImage(image,0,0);alpha=makeCanvas(source.width,source.height);alpha.getContext('2d').drawImage(mask,0,0);$('#sticker-empty').classList.add('hidden');drawEditor();render();}catch(error){notify(error.message);status(error.message);}finally{if(ticket===session)busy(false);}}
  }
  return {open};
}
