// Reconstructed module: identifiers and file boundaries are refactor choices.
const ThreeREVISION="186";const ThreeMOUSE={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2};const ThreeTOUCH={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};const ThreeCullFaceNone=0;const ThreeCullFaceBack=1;const ThreeCullFaceFront=2;const ThreeCullFaceFrontBack=3;const ThreeBasicShadowMap=0;const ThreePCFShadowMap=1;const ThreePCFSoftShadowMap=2;const ThreeVSMShadowMap=3;const ThreeFrontSide=0;const ThreeBackSide=1;const ThreeDoubleSide=2;const ThreeNoBlending=0;const ThreeNormalBlending=1;const ThreeAdditiveBlending=2;const ThreeSubtractiveBlending=3;const ThreeMultiplyBlending=4;const ThreeCustomBlending=5;const ThreeMaterialBlending=6;const ThreeAddEquation=100;const ThreeSubtractEquation=101;const ThreeReverseSubtractEquation=102;const ThreeMinEquation=103;const ThreeMaxEquation=104;const ThreeZeroFactor=200;const ThreeOneFactor=201;const ThreeSrcColorFactor=202;const ThreeOneMinusSrcColorFactor=203;const ThreeSrcAlphaFactor=204;const ThreeOneMinusSrcAlphaFactor=205;const ThreeDstAlphaFactor=206;const ThreeOneMinusDstAlphaFactor=207;const ThreeDstColorFactor=208;const ThreeOneMinusDstColorFactor=209;const ThreeSrcAlphaSaturateFactor=210;const ThreeConstantColorFactor=211;const ThreeOneMinusConstantColorFactor=212;const ThreeConstantAlphaFactor=213;const ThreeOneMinusConstantAlphaFactor=214;const ThreeNeverDepth=0;const ThreeAlwaysDepth=1;const ThreeLessDepth=2;const ThreeLessEqualDepth=3;const ThreeEqualDepth=4;const ThreeGreaterEqualDepth=5;const ThreeGreaterDepth=6;const ThreeNotEqualDepth=7;const ThreeMultiplyOperation=0;const ThreeMixOperation=1;const ThreeAddOperation=2;const ThreeNoToneMapping=0;const ThreeLinearToneMapping=1;const ThreeReinhardToneMapping=2;const ThreeCineonToneMapping=3;const ThreeACESFilmicToneMapping=4;const ThreeCustomToneMapping=5;const ThreeAgXToneMapping=6;const ThreeNeutralToneMapping=7;const ThreeAttachedBindMode="attached";const ThreeDetachedBindMode="detached";const ThreeUVMapping=300;const ThreeCubeReflectionMapping=301;const ThreeCubeRefractionMapping=302;const ThreeEquirectangularReflectionMapping=303;const ThreeEquirectangularRefractionMapping=304;const ThreeCubeUVReflectionMapping=306;const ThreeRepeatWrapping=1e3;const ThreeClampToEdgeWrapping=1001;const ThreeMirroredRepeatWrapping=1002;const ThreeNearestFilter=1003;const ThreeNearestMipmapNearestFilter=1004;const ThreeNearestMipMapNearestFilter=1004;const ThreeNearestMipmapLinearFilter=1005;const ThreeNearestMipMapLinearFilter=1005;const ThreeLinearFilter=1006;const ThreeLinearMipmapNearestFilter=1007;const ThreeLinearMipMapNearestFilter=1007;const ThreeLinearMipmapLinearFilter=1008;const ThreeLinearMipMapLinearFilter=1008;const ThreeUnsignedByteType=1009;const ThreeByteType=1010;const ThreeShortType=1011;const ThreeUnsignedShortType=1012;const ThreeIntType=1013;const ThreeUnsignedIntType=1014;const ThreeFloatType=1015;const ThreeHalfFloatType=1016;const ThreeUnsignedShort4444Type=1017;const ThreeUnsignedShort5551Type=1018;const ThreeUnsignedInt248Type=1020;const ThreeUnsignedInt5999Type=35902;const ThreeUnsignedInt101111Type=35899;const ThreeAlphaFormat=1021;const ThreeRGBFormat=1022;const ThreeRGBAFormat=1023;const ThreeDepthFormat=1026;const ThreeDepthStencilFormat=1027;const ThreeRedFormat=1028;const ThreeRedIntegerFormat=1029;const ThreeRGFormat=1030;const ThreeRGIntegerFormat=1031;const ThreeRGBIntegerFormat=1032;const ThreeRGBAIntegerFormat=1033;const ThreeRGB_S3TC_DXT1_Format=33776;const ThreeRGBA_S3TC_DXT1_Format=33777;const ThreeRGBA_S3TC_DXT3_Format=33778;const ThreeRGBA_S3TC_DXT5_Format=33779;const ThreeRGB_PVRTC_4BPPV1_Format=35840;const ThreeRGB_PVRTC_2BPPV1_Format=35841;const ThreeRGBA_PVRTC_4BPPV1_Format=35842;const ThreeRGBA_PVRTC_2BPPV1_Format=35843;const ThreeRGB_ETC1_Format=36196;const ThreeRGB_ETC2_Format=37492;const ThreeRGBA_ETC2_EAC_Format=37496;const ThreeR11_EAC_Format=37488;const ThreeSIGNED_R11_EAC_Format=37489;const ThreeRG11_EAC_Format=37490;const ThreeSIGNED_RG11_EAC_Format=37491;const ThreeRGBA_ASTC_4x4_Format=37808;const ThreeRGBA_ASTC_5x4_Format=37809;const ThreeRGBA_ASTC_5x5_Format=37810;const ThreeRGBA_ASTC_6x5_Format=37811;const ThreeRGBA_ASTC_6x6_Format=37812;const ThreeRGBA_ASTC_8x5_Format=37813;const ThreeRGBA_ASTC_8x6_Format=37814;const ThreeRGBA_ASTC_8x8_Format=37815;const ThreeRGBA_ASTC_10x5_Format=37816;const ThreeRGBA_ASTC_10x6_Format=37817;const ThreeRGBA_ASTC_10x8_Format=37818;const ThreeRGBA_ASTC_10x10_Format=37819;const ThreeRGBA_ASTC_12x10_Format=37820;const ThreeRGBA_ASTC_12x12_Format=37821;const ThreeRGBA_BPTC_Format=36492;const ThreeRGB_BPTC_SIGNED_Format=36494;const ThreeRGB_BPTC_UNSIGNED_Format=36495;const ThreeRED_RGTC1_Format=36283;const ThreeSIGNED_RED_RGTC1_Format=36284;const ThreeRED_GREEN_RGTC2_Format=36285;const ThreeSIGNED_RED_GREEN_RGTC2_Format=36286;const ThreeLoopOnce=2200;const ThreeLoopRepeat=2201;const ThreeLoopPingPong=2202;const ThreeInterpolateDiscrete=2300;const ThreeInterpolateLinear=2301;const ThreeInterpolateSmooth=2302;const ThreeInterpolateBezier=2303;const ThreeZeroCurvatureEnding=2400;const ThreeZeroSlopeEnding=2401;const ThreeWrapAroundEnding=2402;const ThreeNormalAnimationBlendMode=2500;const ThreeAdditiveAnimationBlendMode=2501;const ThreeTrianglesDrawMode=0;const ThreeTriangleStripDrawMode=1;const ThreeTriangleFanDrawMode=2;const ThreeBasicDepthPacking=3200;const ThreeRGBADepthPacking=3201;const ThreeRGBDepthPacking=3202;const ThreeRGDepthPacking=3203;const ThreeTangentSpaceNormalMap=0;const ThreeObjectSpaceNormalMap=1;const ThreeNoColorSpace="";const ThreeSRGBColorSpace="srgb";const ThreeLinearSRGBColorSpace="srgb-linear";const ThreeLinearTransfer="linear";const ThreeSRGBTransfer="srgb";const ThreeNoNormalPacking="";const ThreeNormalRGPacking="rg";const ThreeNormalGAPacking="ga";const ThreeZeroStencilOp=0;const ThreeKeepStencilOp=7680;const ThreeReplaceStencilOp=7681;const ThreeIncrementStencilOp=7682;const ThreeDecrementStencilOp=7683;const ThreeIncrementWrapStencilOp=34055;const ThreeDecrementWrapStencilOp=34056;const ThreeInvertStencilOp=5386;const ThreeNeverStencilFunc=512;const ThreeLessStencilFunc=513;const ThreeEqualStencilFunc=514;const ThreeLessEqualStencilFunc=515;const ThreeGreaterStencilFunc=516;const ThreeNotEqualStencilFunc=517;const ThreeGreaterEqualStencilFunc=518;const ThreeAlwaysStencilFunc=519;const ThreeNeverCompare=512;const ThreeLessCompare=513;const ThreeEqualCompare=514;const ThreeLessEqualCompare=515;const ThreeGreaterCompare=516;const ThreeNotEqualCompare=517;const ThreeGreaterEqualCompare=518;const ThreeAlwaysCompare=519;const ThreeStaticDrawUsage=35044;const ThreeDynamicDrawUsage=35048;const ThreeStreamDrawUsage=35040;const ThreeStaticReadUsage=35045;const ThreeDynamicReadUsage=35049;const ThreeStreamReadUsage=35041;const ThreeStaticCopyUsage=35046;const ThreeDynamicCopyUsage=35050;const ThreeStreamCopyUsage=35042;const ThreeGLSL1="100";const ThreeGLSL3="300 es";const ThreeWebGLCoordinateSystem=2e3;const ThreeWebGPUCoordinateSystem=2001;const ThreeTimestampQuery={COMPUTE:"compute",RENDER:"render"};const ThreeInterpolationSamplingType={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"};const ThreeInterpolationSamplingMode={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"};const ThreeCompatibility={TEXTURE_COMPARE:"depthTextureCompare"};const ThreeRenderObjectRefreshType={NONE:0,SHARED:1,FULL:2};function f_(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1;}const d_={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function pa(r,t){return new d_[r](t);}function xx(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView);}function ql(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r);}function ThreecreateCanvasElement(){const r=ql("canvas");return r.style.display="block",r;}const Qp={};let Lo=null;function ThreesetConsoleFunction(r){Lo=r;}function ThreegetConsoleFunction(){return Lo;}function Threelog(...r){const t="THREE."+r.shift();Lo?Lo("log",t,...r):console.log(t,...r);}function wx(r){const t=r[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=r[1];e&&e.isStackTrace?r[0]+=" "+e.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.';}return r;}function Threewarn(...r){r=wx(r);const t="THREE."+r.shift();if(Lo)Lo("warn",t,...r);else{const e=r[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...r);}}function Threeerror(...r){r=wx(r);const t="THREE."+r.shift();if(Lo)Lo("error",t,...r);else{const e=r[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...r);}}function ThreewarnOnce(...r){const t=r.join(" ");t in Qp||(Qp[t]=!0,Threewarn(...r));}function g_(r,t,e){return new Promise(function(i,s){function n(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:s();break;case r.TIMEOUT_EXPIRED:setTimeout(n,e);break;default:i();}}setTimeout(n,e);});}const v_={[ThreeNeverDepth]:ThreeAlwaysDepth,[ThreeLessDepth]:ThreeGreaterDepth,[ThreeEqualDepth]:ThreeNotEqualDepth,[ThreeLessEqualDepth]:ThreeGreaterEqualDepth,[ThreeAlwaysDepth]:ThreeNeverDepth,[ThreeGreaterDepth]:ThreeLessDepth,[ThreeNotEqualDepth]:ThreeEqualDepth,[ThreeGreaterEqualDepth]:ThreeLessEqualDepth};class ThreeEventDispatcher{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e);}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1;}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const n=s.indexOf(e);n!==-1&&s.splice(n,1);}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let n=0,o=s.length;n<o;n++)s[n].call(this,t);t.target=null;}}}const Xi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let tm=1234567;const pr=Math.PI/180;const Ta=180/Math.PI;function Rs(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xi[r&255]+Xi[r>>8&255]+Xi[r>>16&255]+Xi[r>>24&255]+"-"+Xi[t&255]+Xi[t>>8&255]+"-"+Xi[t>>16&15|64]+Xi[t>>24&255]+"-"+Xi[e&63|128]+Xi[e>>8&255]+"-"+Xi[e>>16&255]+Xi[e>>24&255]+Xi[i&255]+Xi[i>>8&255]+Xi[i>>16&255]+Xi[i>>24&255]).toLowerCase();}function ge(r,t,e){return Math.max(t,Math.min(e,r));}function np(r,t){return(r%t+t)%t;}function x_(r,t,e,i,s){return i+(r-t)*(s-i)/(e-t);}function y_(r,t,e){return r!==t?(e-r)/(t-r):0;}function Pl(r,t,e){return(1-e)*r+e*t;}function w_(r,t,e,i){return Pl(r,t,1-Math.exp(-e*i));}function __(r,t=1){return t-Math.abs(np(r,t*2)-t);}function b_(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r));}function M_(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10));}function S_(r,t){return r+Math.floor(Math.random()*(t-r+1));}function A_(r,t){return r+Math.random()*(t-r);}function T_(r){return r*(.5-Math.random());}function E_(r){r!==void 0&&(tm=r);let t=tm+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296;}function C_(r){return r*pr;}function R_(r){return r*Ta;}function z_(r){return r>0&&Number.isInteger(r)&&2**Math.round(Math.log2(r))===r;}function P_(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2));}function L_(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2));}function I_(r,t,e,i,s){const n=Math.cos,o=Math.sin,a=n(e/2),l=o(e/2),c=n((t+i)/2),h=o((t+i)/2),f=n((t-i)/2),u=o((t-i)/2),d=n((i-t)/2),p=o((i-t)/2);switch(s){case"XYX":r.set(a*h,l*f,l*u,a*c);break;case"YZY":r.set(l*u,a*h,l*f,a*c);break;case"ZXZ":r.set(l*f,l*u,a*h,a*c);break;case"XZX":r.set(a*h,l*p,l*d,a*c);break;case"YXY":r.set(l*d,a*h,l*p,a*c);break;case"ZYZ":r.set(l*p,l*d,a*h,a*c);break;default:Threewarn("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s);}}function cs(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:case Uint8ClampedArray:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.");}}function _e(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.");}}const ThreeMathUtils={DEG2RAD:pr,RAD2DEG:Ta,generateUUID:Rs,clamp:ge,euclideanModulo:np,mapLinear:x_,inverseLerp:y_,lerp:Pl,damp:w_,pingpong:__,smoothstep:b_,smootherstep:M_,randInt:S_,randFloat:A_,randFloatSpread:T_,seededRandom:E_,degToRad:C_,radToDeg:R_,isPowerOfTwo:z_,ceilPowerOfTwo:P_,floorPowerOfTwo:L_,setQuaternionFromProperEuler:I_,normalize:_e,denormalize:cs};const Up=class Up{constructor(t=0,e=0){this.x=t,this.y=e;}get width(){return this.x;}set width(t){this.x=t;}get height(){return this.y;}set height(t){this.y=t;}set(t,e){return this.x=t,this.y=e,this;}setScalar(t){return this.x=t,this.y=t,this;}setX(t){return this.x=t,this;}setY(t){return this.y=t,this;}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t);}return this;}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t);}}clone(){return new this.constructor(this.x,this.y);}copy(t){return this.x=t.x,this.y=t.y,this;}add(t){return this.x+=t.x,this.y+=t.y,this;}addScalar(t){return this.x+=t,this.y+=t,this;}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this;}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this;}sub(t){return this.x-=t.x,this.y-=t.y,this;}subScalar(t){return this.x-=t,this.y-=t,this;}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this;}multiply(t){return this.x*=t.x,this.y*=t.y,this;}multiplyScalar(t){return this.x*=t,this.y*=t,this;}divide(t){return this.x/=t.x,this.y/=t.y,this;}divideScalar(t){return this.multiplyScalar(1/t);}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this;}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this;}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this;}clamp(t,e){return this.x=ge(this.x,t.x,e.x),this.y=ge(this.y,t.y,e.y),this;}clampScalar(t,e){return this.x=ge(this.x,t,e),this.y=ge(this.y,t,e),this;}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ge(i,t,e));}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this;}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this;}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this;}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this;}negate(){return this.x=-this.x,this.y=-this.y,this;}dot(t){return this.x*t.x+this.y*t.y;}cross(t){return this.x*t.y-this.y*t.x;}lengthSq(){return this.x*this.x+this.y*this.y;}length(){return Math.sqrt(this.x*this.x+this.y*this.y);}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y);}normalize(){return this.divideScalar(this.length()||1);}angle(){return Math.atan2(-this.y,-this.x)+Math.PI;}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ge(i,-1,1));}distanceTo(t){return Math.sqrt(this.distanceToSquared(t));}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i;}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y);}setLength(t){return this.normalize().multiplyScalar(t);}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this;}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this;}equals(t){return t.x===this.x&&t.y===this.y;}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this;}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t;}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this;}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),n=this.x-t.x,o=this.y-t.y;return this.x=n*i-o*s+t.x,this.y=n*s+o*i+t.y,this;}random(){return this.x=Math.random(),this.y=Math.random(),this;}*[Symbol.iterator](){yield this.x,yield this.y;}};Up.prototype.isVector2=!0;let ThreeVector2=Up;class ThreeQuaternion{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s;}static slerpFlat(t,e,i,s,n,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3],u=n[o+0],d=n[o+1],p=n[o+2],v=n[o+3];if(f!==v||l!==u||c!==d||h!==p){let g=l*u+c*d+h*p+f*v;g<0&&(u=-u,d=-d,p=-p,v=-v,g=-g);let x=1-a;if(g<.9995){const m=Math.acos(g),w=Math.sin(m);x=Math.sin(x*m)/w,a=Math.sin(a*m)/w,l=l*x+u*a,c=c*x+d*a,h=h*x+p*a,f=f*x+v*a;}else{l=l*x+u*a,c=c*x+d*a,h=h*x+p*a,f=f*x+v*a;const m=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=m,c*=m,h*=m,f*=m;}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;}static multiplyQuaternionsFlat(t,e,i,s,n,o){const a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=n[o],u=n[o+1],d=n[o+2],p=n[o+3];return t[e]=a*p+h*f+l*d-c*u,t[e+1]=l*p+h*u+c*f-a*d,t[e+2]=c*p+h*d+a*u-l*f,t[e+3]=h*p-a*f-l*u-c*d,t;}get x(){return this._x;}set x(t){this._x=t,this._onChangeCallback();}get y(){return this._y;}set y(t){this._y=t,this._onChangeCallback();}get z(){return this._z;}set z(t){this._z=t,this._onChangeCallback();}get w(){return this._w;}set w(t){this._w=t,this._onChangeCallback();}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this;}clone(){return new this.constructor(this._x,this._y,this._z,this._w);}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this;}setFromEuler(t,e=!0){const i=t._x,s=t._y,n=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),f=a(n/2),u=l(i/2),d=l(s/2),p=l(n/2);switch(o){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:Threewarn("Quaternion: .setFromEuler() encountered an unknown order: "+o);}return e===!0&&this._onChangeCallback(),this;}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this;}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],n=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=i+a+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(n-c)*d,this._z=(o-s)*d;}else if(i>a&&i>f){const d=2*Math.sqrt(1+i-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(n+c)/d;}else if(a>f){const d=2*Math.sqrt(1+a-i-f);this._w=(n-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d;}else{const d=2*Math.sqrt(1+f-i-a);this._w=(o-s)/d,this._x=(n+c)/d,this._y=(l+h)/d,this._z=.25*d;}return this._onChangeCallback(),this;}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize();}angleTo(t){return 2*Math.acos(Math.abs(ge(this.dot(t),-1,1)));}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this;}identity(){return this.set(0,0,0,1);}invert(){return this.conjugate();}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this;}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w;}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w;}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w);}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this;}multiply(t){return this.multiplyQuaternions(this,t);}premultiply(t){return this.multiplyQuaternions(t,this);}multiplyQuaternions(t,e){const i=t._x,s=t._y,n=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+s*c-n*l,this._y=s*h+o*l+n*a-i*c,this._z=n*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-n*c,this._onChangeCallback(),this;}slerp(t,e){let i=t._x,s=t._y,n=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,s=-s,n=-n,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+n*e,this._w=this._w*l+o*e,this._onChangeCallback();}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+n*e,this._w=this._w*l+o*e,this.normalize();return this;}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i);}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),n=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),n*Math.sin(e),n*Math.cos(e));}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w;}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this;}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t;}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this;}toJSON(){return this.toArray();}_onChange(t){return this._onChangeCallback=t,this;}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w;}}const Op=class Op{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i;}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this;}setScalar(t){return this.x=t,this.y=t,this.z=t,this;}setX(t){return this.x=t,this;}setY(t){return this.y=t,this;}setZ(t){return this.z=t,this;}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t);}return this;}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t);}}clone(){return new this.constructor(this.x,this.y,this.z);}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this;}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this;}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this;}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this;}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this;}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this;}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this;}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this;}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this;}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this;}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this;}applyEuler(t){return this.applyQuaternion(em.setFromEuler(t));}applyAxisAngle(t,e){return this.applyQuaternion(em.setFromAxisAngle(t,e));}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6]*s,this.y=n[1]*e+n[4]*i+n[7]*s,this.z=n[2]*e+n[5]*i+n[8]*s,this;}applyNormalMatrix(t){return this.applyMatrix3(t).normalize();}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,n=t.elements,o=1/(n[3]*e+n[7]*i+n[11]*s+n[15]);return this.x=(n[0]*e+n[4]*i+n[8]*s+n[12])*o,this.y=(n[1]*e+n[5]*i+n[9]*s+n[13])*o,this.z=(n[2]*e+n[6]*i+n[10]*s+n[14])*o,this;}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,n=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),h=2*(a*e-n*s),f=2*(n*i-o*e);return this.x=e+l*c+o*f-a*h,this.y=i+l*h+a*c-n*f,this.z=s+l*f+n*h-o*c,this;}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);}transformDirection(t){const e=this.x,i=this.y,s=this.z,n=t.elements;return this.x=n[0]*e+n[4]*i+n[8]*s,this.y=n[1]*e+n[5]*i+n[9]*s,this.z=n[2]*e+n[6]*i+n[10]*s,this.normalize();}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this;}divideScalar(t){return this.multiplyScalar(1/t);}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this;}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this;}clamp(t,e){return this.x=ge(this.x,t.x,e.x),this.y=ge(this.y,t.y,e.y),this.z=ge(this.z,t.z,e.z),this;}clampScalar(t,e){return this.x=ge(this.x,t,e),this.y=ge(this.y,t,e),this.z=ge(this.z,t,e),this;}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ge(i,t,e));}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this;}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this;}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this;}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this;}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this;}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z;}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z;}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z);}normalize(){return this.divideScalar(this.length()||1);}setLength(t){return this.normalize().multiplyScalar(t);}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this;}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this;}cross(t){return this.crossVectors(this,t);}crossVectors(t,e){const i=t.x,s=t.y,n=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-n*a,this.y=n*o-i*l,this.z=i*a-s*o,this;}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i);}projectOnPlane(t){return Uu.copy(this).projectOnVector(t),this.sub(Uu);}reflect(t){return this.sub(Uu.copy(t).multiplyScalar(2*this.dot(t)));}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ge(i,-1,1));}distanceTo(t){return Math.sqrt(this.distanceToSquared(t));}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s;}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z);}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta);}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this;}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y);}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this;}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this;}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this;}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4);}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3);}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this;}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this;}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z;}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this;}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t;}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this;}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this;}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this;}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z;}};Op.prototype.isVector3=!0;let ThreeVector3=Op;const Uu=new ThreeVector3();const em=new ThreeQuaternion();const Bp=class Bp{constructor(t,e,i,s,n,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,n,o,a,l,c);}set(t,e,i,s,n,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=n,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this;}identity(){return this.set(1,0,0,0,1,0,0,0,1),this;}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this;}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this;}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this;}multiply(t){return this.multiplyMatrices(this,t);}premultiply(t){return this.multiplyMatrices(t,this);}multiplyMatrices(t,e){const i=t.elements,s=e.elements,n=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],d=i[5],p=i[8],v=s[0],g=s[3],x=s[6],m=s[1],w=s[4],y=s[7],_=s[2],M=s[5],A=s[8];return n[0]=o*v+a*m+l*_,n[3]=o*g+a*w+l*M,n[6]=o*x+a*y+l*A,n[1]=c*v+h*m+f*_,n[4]=c*g+h*w+f*M,n[7]=c*x+h*y+f*A,n[2]=u*v+d*m+p*_,n[5]=u*g+d*w+p*M,n[8]=u*x+d*y+p*A,this;}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this;}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*n*h+i*a*l+s*n*c-s*o*l;}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,u=a*l-h*n,d=c*n-o*l,p=e*f+i*u+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=f*v,t[1]=(s*c-h*i)*v,t[2]=(a*i-s*o)*v,t[3]=u*v,t[4]=(h*e-s*l)*v,t[5]=(s*n-a*e)*v,t[6]=d*v,t[7]=(i*l-c*e)*v,t[8]=(o*e-i*n)*v,this;}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this;}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose();}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this;}setUvTransform(t,e,i,s,n,o,a){const l=Math.cos(n),c=Math.sin(n);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this;}scale(t,e){return ThreewarnOnce("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ou.makeScale(t,e)),this;}rotate(t){return ThreewarnOnce("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ou.makeRotation(-t)),this;}translate(t,e){return ThreewarnOnce("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ou.makeTranslation(t,e)),this;}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this;}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this;}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this;}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0;}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this;}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t;}clone(){return new this.constructor().fromArray(this.elements);}};Bp.prototype.isMatrix3=!0;let ThreeMatrix3=Bp;const Ou=new ThreeMatrix3();const im=new ThreeMatrix3().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322);const sm=new ThreeMatrix3().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function k_(){const r={enabled:!0,workingColorSpace:ThreeLinearSRGBColorSpace,spaces:{},convert:function(s,n,o){return this.enabled===!1||n===o||!n||!o||(this.spaces[n].transfer===ThreeSRGBTransfer&&(s.r=io(s.r),s.g=io(s.g),s.b=io(s.b)),this.spaces[n].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[n].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ThreeSRGBTransfer&&(s.r=xa(s.r),s.g=xa(s.g),s.b=xa(s.b))),s;},workingToColorSpace:function(s,n){return this.convert(s,this.workingColorSpace,n);},colorSpaceToWorking:function(s,n){return this.convert(s,n,this.workingColorSpace);},getPrimaries:function(s){return this.spaces[s].primaries;},getTransfer:function(s){return s===ThreeNoColorSpace?ThreeLinearTransfer:this.spaces[s].transfer;},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard";},getLuminanceCoefficients:function(s,n=this.workingColorSpace){return s.fromArray(this.spaces[n].luminanceCoefficients);},define:function(s){Object.assign(this.spaces,s);},_getMatrix:function(s,n,o){return s.copy(this.spaces[n].toXYZ).multiply(this.spaces[o].fromXYZ);},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace;},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace;},fromWorkingColorSpace:function(s,n){return ThreewarnOnce("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(s,n);},toWorkingColorSpace:function(s,n){return ThreewarnOnce("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(s,n);}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[ThreeLinearSRGBColorSpace]:{primaries:t,whitePoint:i,transfer:ThreeLinearTransfer,toXYZ:im,fromXYZ:sm,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ThreeSRGBColorSpace},outputColorSpaceConfig:{drawingBufferColorSpace:ThreeSRGBColorSpace}},[ThreeSRGBColorSpace]:{primaries:t,whitePoint:i,transfer:ThreeSRGBTransfer,toXYZ:im,fromXYZ:sm,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ThreeSRGBColorSpace}}}),r;}const ThreeColorManagement=k_();function io(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4);}function xa(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055;}let kr;class ThreeImageUtils{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{kr===void 0&&(kr=ql("canvas")),kr.width=t.width,kr.height=t.height;const s=kr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=kr;}return i.toDataURL(e);}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ql("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),n=s.data;for(let o=0;o<n.length;o++)n[o]=io(n[o]/255)*255;return i.putImageData(s,0,0),e;}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(io(e[i]/255)*255):e[i]=io(e[i]);return{data:e,width:t.width,height:t.height};}else return Threewarn("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t;}}let D_=0;class ThreeTextureSource{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:D_++}),this.uuid=Rs(),this.data=t,this.dataReady=!0,this.version=0;}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t;}set needsUpdate(t){t===!0&&this.version++;}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let n;if(Array.isArray(s)){n=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?n.push(Bu(s[o].image)):n.push(Bu(s[o]));}else n=Bu(s);i.url=n;}return e||(t.images[this.uuid]=i),i;}}function Bu(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?ThreeImageUtils.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Threewarn("Texture: Unable to serialize Texture."),{});}class ThreeSource extends ThreeTextureSource{constructor(t=null){ThreewarnOnce('Source: "Source" has been renamed to "TextureSource". Please update your code to use "THREE.TextureSource" instead.'),super(t),this.isSource=!0;}}let N_=0;const Vu=new ThreeVector3();class ThreeTexture extends ThreeEventDispatcher{constructor(t=ThreeTexture.DEFAULT_IMAGE,e=ThreeTexture.DEFAULT_MAPPING,i=ThreeClampToEdgeWrapping,s=ThreeClampToEdgeWrapping,n=ThreeLinearFilter,o=ThreeLinearMipmapLinearFilter,a=ThreeRGBAFormat,l=ThreeUnsignedByteType,c=ThreeTexture.DEFAULT_ANISOTROPY,h=ThreeNoColorSpace){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:N_++}),this.uuid=Rs(),this.name="",this.source=new ThreeTextureSource(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=n,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ThreeVector2(0,0),this.repeat=new ThreeVector2(1,1),this.center=new ThreeVector2(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ThreeMatrix3(),this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1;}get width(){return this.source.getSize(Vu).x;}get height(){return this.source.getSize(Vu).y;}get depth(){return this.source.getSize(Vu).z;}get image(){return this.source.data;}set image(t){this.source.data=t;}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y);}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e});}clearUpdateRanges(){this.updateRanges.length=0;}clone(){return new this.constructor().copy(this);}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this;}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Threewarn(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue;}const s=this[e];if(s===void 0){Threewarn(`Texture.setValues(): property '${e}' does not exist.`);continue;}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i;}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i;}dispose(){this.dispatchEvent({type:"dispose"});}transformUv(t){if(this.mapping!==ThreeUVMapping)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ThreeRepeatWrapping:t.x=t.x-Math.floor(t.x);break;case ThreeClampToEdgeWrapping:t.x=t.x<0?0:1;break;case ThreeMirroredRepeatWrapping:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break;}if(t.y<0||t.y>1)switch(this.wrapT){case ThreeRepeatWrapping:t.y=t.y-Math.floor(t.y);break;case ThreeClampToEdgeWrapping:t.y=t.y<0?0:1;break;case ThreeMirroredRepeatWrapping:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break;}return this.flipY&&(t.y=1-t.y),t;}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0);}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++;}}ThreeTexture.DEFAULT_IMAGE=null;ThreeTexture.DEFAULT_MAPPING=ThreeUVMapping;ThreeTexture.DEFAULT_ANISOTROPY=1;const Vp=class Vp{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s;}get width(){return this.z;}set width(t){this.z=t;}get height(){return this.w;}set height(t){this.w=t;}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this;}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this;}setX(t){return this.x=t,this;}setY(t){return this.y=t,this;}setZ(t){return this.z=t,this;}setW(t){return this.w=t,this;}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t);}return this;}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t);}}clone(){return new this.constructor(this.x,this.y,this.z,this.w);}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this;}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this;}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this;}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this;}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this;}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this;}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this;}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this;}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this;}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this;}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,n=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*n,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*n,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*n,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*n,this;}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this;}divideScalar(t){return this.multiplyScalar(1/t);}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this;}setAxisAngleFromRotationMatrix(t){let e,i,s,n;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],v=l[2],g=l[6],x=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+d+x-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,y=(d+1)/2,_=(x+1)/2,M=(h+u)/4,A=(f+v)/4,b=(p+g)/4;return w>y&&w>_?w<.01?(i=0,s=.707106781,n=.707106781):(i=Math.sqrt(w),s=M/i,n=A/i):y>_?y<.01?(i=.707106781,s=0,n=.707106781):(s=Math.sqrt(y),i=M/s,n=b/s):_<.01?(i=.707106781,s=.707106781,n=0):(n=Math.sqrt(_),i=A/n,s=b/n),this.set(i,s,n,e),this;}let m=Math.sqrt((g-p)*(g-p)+(f-v)*(f-v)+(u-h)*(u-h));return Math.abs(m)<.001&&(m=1),this.x=(g-p)/m,this.y=(f-v)/m,this.z=(u-h)/m,this.w=Math.acos((c+d+x-1)/2),this;}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this;}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this;}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this;}clamp(t,e){return this.x=ge(this.x,t.x,e.x),this.y=ge(this.y,t.y,e.y),this.z=ge(this.z,t.z,e.z),this.w=ge(this.w,t.w,e.w),this;}clampScalar(t,e){return this.x=ge(this.x,t,e),this.y=ge(this.y,t,e),this.z=ge(this.z,t,e),this.w=ge(this.w,t,e),this;}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ge(i,t,e));}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this;}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this;}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this;}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this;}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this;}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w;}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w;}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w);}normalize(){return this.divideScalar(this.length()||1);}setLength(t){return this.normalize().multiplyScalar(t);}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this;}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this;}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w;}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this;}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t;}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this;}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this;}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w;}};Vp.prototype.isVector4=!0;let ThreeVector4=Vp;class ThreeRenderTarget extends ThreeEventDispatcher{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ThreeLinearFilter,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new ThreeVector4(0,0,t,e),this.scissorTest=!1,this.viewport=new ThreeVector4(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:i.depth},n=new ThreeTexture(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=n.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture;}_setTextureOptions(t={}){const e={minFilter:ThreeLinearFilter,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e);}get texture(){return this.textures[0];}set texture(t){this.textures[0]=t;}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t;}get depthTexture(){return this._depthTexture;}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,n=this.textures.length;s<n;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose();}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e);}clone(){return new this.constructor().copy(this);}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new ThreeTextureSource(s);}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e;}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this;}dispose(){this.dispatchEvent({type:"dispose"});}}class ThreeWebGLRenderTarget extends ThreeRenderTarget{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0;}}class ThreeDataArrayTexture extends ThreeTexture{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=ThreeNearestFilter,this.minFilter=ThreeNearestFilter,this.wrapR=ThreeClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set();}copy(t){return super.copy(t),this.wrapR=t.wrapR,this;}addLayerUpdate(t){this.layerUpdates.add(t);}clearLayerUpdates(){this.layerUpdates.clear();}}class ThreeWebGLArrayRenderTarget extends ThreeWebGLRenderTarget{constructor(t=1,e=1,i=1,s={}){super(t,e,s),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new ThreeDataArrayTexture(null,t,e,i),this._setTextureOptions(s),this.texture.isRenderTargetTexture=!0;}}class ThreeData3DTexture extends ThreeTexture{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=ThreeNearestFilter,this.minFilter=ThreeNearestFilter,this.wrapR=ThreeClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1;}copy(t){return super.copy(t),this.wrapR=t.wrapR,this;}}class ThreeWebGL3DRenderTarget extends ThreeWebGLRenderTarget{constructor(t=1,e=1,i=1,s={}){super(t,e,s),this.isWebGL3DRenderTarget=!0,this.depth=i,this.texture=new ThreeData3DTexture(null,t,e,i),this._setTextureOptions(s),this.texture.isRenderTargetTexture=!0;}}const X0=class X0{constructor(t,e,i,s,n,o,a,l,c,h,f,u,d,p,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,n,o,a,l,c,h,f,u,d,p,v,g);}set(t,e,i,s,n,o,a,l,c,h,f,u,d,p,v,g){const x=this.elements;return x[0]=t,x[4]=e,x[8]=i,x[12]=s,x[1]=n,x[5]=o,x[9]=a,x[13]=l,x[2]=c,x[6]=h,x[10]=f,x[14]=u,x[3]=d,x[7]=p,x[11]=v,x[15]=g,this;}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this;}clone(){return new X0().fromArray(this.elements);}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this;}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this;}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this;}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this);}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this;}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,s=1/Dr.setFromMatrixColumn(t,0).length(),n=1/Dr.setFromMatrixColumn(t,1).length(),o=1/Dr.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*n,e[5]=i[5]*n,e[6]=i[6]*n,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this;}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,n=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(n),f=Math.sin(n);if(t.order==="XYZ"){const u=o*h,d=o*f,p=a*h,v=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+p*c,e[5]=u-v*c,e[9]=-a*l,e[2]=v-u*c,e[6]=p+d*c,e[10]=o*l;}else if(t.order==="YXZ"){const u=l*h,d=l*f,p=c*h,v=c*f;e[0]=u+v*a,e[4]=p*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=d*a-p,e[6]=v+u*a,e[10]=o*l;}else if(t.order==="ZXY"){const u=l*h,d=l*f,p=c*h,v=c*f;e[0]=u-v*a,e[4]=-o*f,e[8]=p+d*a,e[1]=d+p*a,e[5]=o*h,e[9]=v-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l;}else if(t.order==="ZYX"){const u=o*h,d=o*f,p=a*h,v=a*f;e[0]=l*h,e[4]=p*c-d,e[8]=u*c+v,e[1]=l*f,e[5]=v*c+u,e[9]=d*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l;}else if(t.order==="YZX"){const u=o*l,d=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=v-u*f,e[8]=p*f+d,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+p,e[10]=u-v*f;}else if(t.order==="XZY"){const u=o*l,d=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+v,e[5]=o*h,e[9]=d*f-p,e[2]=p*f-d,e[6]=a*h,e[10]=v*f+u;}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this;}makeRotationFromQuaternion(t){return this.compose(B_,t,V_);}lookAt(t,e,i){const s=this.elements;return bs.subVectors(t,e),bs.lengthSq()===0&&(bs.z=1),bs.normalize(),po.crossVectors(i,bs),po.lengthSq()===0&&(Math.abs(i.z)===1?bs.x+=1e-4:bs.z+=1e-4,bs.normalize(),po.crossVectors(i,bs)),po.normalize(),wc.crossVectors(bs,po),s[0]=po.x,s[4]=wc.x,s[8]=bs.x,s[1]=po.y,s[5]=wc.y,s[9]=bs.y,s[2]=po.z,s[6]=wc.z,s[10]=bs.z,this;}multiply(t){return this.multiplyMatrices(this,t);}premultiply(t){return this.multiplyMatrices(t,this);}multiplyMatrices(t,e){const i=t.elements,s=e.elements,n=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],d=i[13],p=i[2],v=i[6],g=i[10],x=i[14],m=i[3],w=i[7],y=i[11],_=i[15],M=s[0],A=s[4],b=s[8],S=s[12],E=s[1],T=s[5],R=s[9],z=s[13],L=s[2],k=s[6],U=s[10],F=s[14],G=s[3],B=s[7],q=s[11],X=s[15];return n[0]=o*M+a*E+l*L+c*G,n[4]=o*A+a*T+l*k+c*B,n[8]=o*b+a*R+l*U+c*q,n[12]=o*S+a*z+l*F+c*X,n[1]=h*M+f*E+u*L+d*G,n[5]=h*A+f*T+u*k+d*B,n[9]=h*b+f*R+u*U+d*q,n[13]=h*S+f*z+u*F+d*X,n[2]=p*M+v*E+g*L+x*G,n[6]=p*A+v*T+g*k+x*B,n[10]=p*b+v*R+g*U+x*q,n[14]=p*S+v*z+g*F+x*X,n[3]=m*M+w*E+y*L+_*G,n[7]=m*A+w*T+y*k+_*B,n[11]=m*b+w*R+y*U+_*q,n[15]=m*S+w*z+y*F+_*X,this;}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this;}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],n=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],p=t[3],v=t[7],g=t[11],x=t[15],m=l*d-c*u,w=a*d-c*f,y=a*u-l*f,_=o*d-c*h,M=o*u-l*h,A=o*f-a*h;return e*(v*m-g*w+x*y)-i*(p*m-g*_+x*M)+s*(p*w-v*_+x*A)-n*(p*y-v*M+g*A);}determinantAffine(){const t=this.elements,e=t[0],i=t[4],s=t[8],n=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-i*(n*h-a*l)+s*(n*c-o*l);}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this;}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this;}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],p=t[12],v=t[13],g=t[14],x=t[15],m=e*a-i*o,w=e*l-s*o,y=e*c-n*o,_=i*l-s*a,M=i*c-n*a,A=s*c-n*l,b=h*v-f*p,S=h*g-u*p,E=h*x-d*p,T=f*g-u*v,R=f*x-d*v,z=u*x-d*g,L=m*z-w*R+y*T+_*E-M*S+A*b;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/L;return t[0]=(a*z-l*R+c*T)*k,t[1]=(s*R-i*z-n*T)*k,t[2]=(v*A-g*M+x*_)*k,t[3]=(u*M-f*A-d*_)*k,t[4]=(l*E-o*z-c*S)*k,t[5]=(e*z-s*E+n*S)*k,t[6]=(g*y-p*A-x*w)*k,t[7]=(h*A-u*y+d*w)*k,t[8]=(o*R-a*E+c*b)*k,t[9]=(i*E-e*R-n*b)*k,t[10]=(p*M-v*y+x*m)*k,t[11]=(f*y-h*M-d*m)*k,t[12]=(a*S-o*T-l*b)*k,t[13]=(e*T-i*S+s*b)*k,t[14]=(v*w-p*_-g*m)*k,t[15]=(h*_-f*w+u*m)*k,this;}scale(t){const e=this.elements,i=t.x,s=t.y,n=t.z;return e[0]*=i,e[4]*=s,e[8]*=n,e[1]*=i,e[5]*=s,e[9]*=n,e[2]*=i,e[6]*=s,e[10]*=n,e[3]*=i,e[7]*=s,e[11]*=n,this;}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s));}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this;}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this;}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this;}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this;}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),n=1-i,o=t.x,a=t.y,l=t.z,c=n*o,h=n*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,n*l*l+i,0,0,0,0,1),this;}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this;}makeShear(t,e,i,s,n,o){return this.set(1,i,n,0,t,1,o,0,e,s,1,0,0,0,0,1),this;}compose(t,e,i){const s=this.elements,n=e._x,o=e._y,a=e._z,l=e._w,c=n+n,h=o+o,f=a+a,u=n*c,d=n*h,p=n*f,v=o*h,g=o*f,x=a*f,m=l*c,w=l*h,y=l*f,_=i.x,M=i.y,A=i.z;return s[0]=(1-(v+x))*_,s[1]=(d+y)*_,s[2]=(p-w)*_,s[3]=0,s[4]=(d-y)*M,s[5]=(1-(u+x))*M,s[6]=(g+m)*M,s[7]=0,s[8]=(p+w)*A,s[9]=(g-m)*A,s[10]=(1-(u+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this;}decompose(t,e,i){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const n=this.determinantAffine();if(n===0)return i.set(1,1,1),e.identity(),this;let o=Dr.set(s[0],s[1],s[2]).length();const a=Dr.set(s[4],s[5],s[6]).length(),l=Dr.set(s[8],s[9],s[10]).length();n<0&&(o=-o),Xs.copy(this);const c=1/o,h=1/a,f=1/l;return Xs.elements[0]*=c,Xs.elements[1]*=c,Xs.elements[2]*=c,Xs.elements[4]*=h,Xs.elements[5]*=h,Xs.elements[6]*=h,Xs.elements[8]*=f,Xs.elements[9]*=f,Xs.elements[10]*=f,e.setFromRotationMatrix(Xs),i.x=o,i.y=a,i.z=l,this;}makePerspective(t,e,i,s,n,o,a=ThreeWebGLCoordinateSystem,l=!1){const c=this.elements,h=2*n/(e-t),f=2*n/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s);let p,v;if(l)p=n/(o-n),v=o*n/(o-n);else if(a===ThreeWebGLCoordinateSystem)p=-(o+n)/(o-n),v=-2*o*n/(o-n);else if(a===ThreeWebGPUCoordinateSystem)p=-o/(o-n),v=-o*n/(o-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this;}makeOrthographic(t,e,i,s,n,o,a=ThreeWebGLCoordinateSystem,l=!1){const c=this.elements,h=2/(e-t),f=2/(i-s),u=-(e+t)/(e-t),d=-(i+s)/(i-s);let p,v;if(l)p=1/(o-n),v=o/(o-n);else if(a===ThreeWebGLCoordinateSystem)p=-2/(o-n),v=-(o+n)/(o-n);else if(a===ThreeWebGPUCoordinateSystem)p=-1/(o-n),v=-n/(o-n);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this;}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0;}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this;}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t;}};X0.prototype.isMatrix4=!0;let ThreeMatrix4=X0;const Dr=new ThreeVector3();const Xs=new ThreeMatrix4();const B_=new ThreeVector3(0,0,0);const V_=new ThreeVector3(1,1,1);const po=new ThreeVector3();const wc=new ThreeVector3();const bs=new ThreeVector3();const nm=new ThreeMatrix4();const om=new ThreeQuaternion();class ThreeEuler{constructor(t=0,e=0,i=0,s=ThreeEuler.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s;}get x(){return this._x;}set x(t){this._x=t,this._onChangeCallback();}get y(){return this._y;}set y(t){this._y=t,this._onChangeCallback();}get z(){return this._z;}set z(t){this._z=t,this._onChangeCallback();}get order(){return this._order;}set order(t){this._order=t,this._onChangeCallback();}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this;}clone(){return new this.constructor(this._x,this._y,this._z,this._order);}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this;}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,n=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,n)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,n),this._z=0);break;case"ZXY":this._x=Math.asin(ge(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-ge(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,n)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,n)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Threewarn("Euler: .setFromRotationMatrix() encountered an unknown order: "+e);}return this._order=e,i===!0&&this._onChangeCallback(),this;}setFromQuaternion(t,e,i){return nm.makeRotationFromQuaternion(t),this.setFromRotationMatrix(nm,e,i);}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e);}reorder(t){return om.setFromEuler(this),this.setFromQuaternion(om,t);}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order;}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this;}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t;}_onChange(t){return this._onChangeCallback=t,this;}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order;}}ThreeEuler.DEFAULT_ORDER="XYZ";class ThreeLayers{constructor(){this.mask=1;}set(t){this.mask=(1<<t|0)>>>0;}enable(t){this.mask|=1<<t|0;}enableAll(){this.mask=-1;}toggle(t){this.mask^=1<<t|0;}disable(t){this.mask&=~(1<<t|0);}disableAll(){this.mask=0;}test(t){return(this.mask&t.mask)!==0;}isEnabled(t){return(this.mask&(1<<t|0))!==0;}}let G_=0;const rm=new ThreeVector3();const Fr=new ThreeQuaternion();const Bn=new ThreeMatrix4();const _c=new ThreeVector3();const Ga=new ThreeVector3();const H_=new ThreeVector3();const W_=new ThreeQuaternion();const am=new ThreeVector3(1,0,0);const lm=new ThreeVector3(0,1,0);const cm=new ThreeVector3(0,0,1);const hm={type:"added"};const q_={type:"removed"};const Nr={type:"childadded",child:null};const Gu={type:"childremoved",child:null};class ThreeObject3D extends ThreeEventDispatcher{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:G_++}),this.uuid=Rs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ThreeObject3D.DEFAULT_UP.clone();const t=new ThreeVector3(),e=new ThreeEuler(),i=new ThreeQuaternion(),s=new ThreeVector3(1,1,1);function n(){i.setFromEuler(e,!1);}function o(){e.setFromQuaternion(i,void 0,!1);}e._onChange(n),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ThreeMatrix4()},normalMatrix:{value:new ThreeMatrix3()}}),this.matrix=new ThreeMatrix4(),this.matrixWorld=new ThreeMatrix4(),this.matrixAutoUpdate=ThreeObject3D.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ThreeObject3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ThreeLayers(),this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null;}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale);}applyQuaternion(t){return this.quaternion.premultiply(t),this;}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e);}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0);}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t);}setRotationFromQuaternion(t){this.quaternion.copy(t);}rotateOnAxis(t,e){return Fr.setFromAxisAngle(t,e),this.quaternion.multiply(Fr),this;}rotateOnWorldAxis(t,e){return Fr.setFromAxisAngle(t,e),this.quaternion.premultiply(Fr),this;}rotateX(t){return this.rotateOnAxis(am,t);}rotateY(t){return this.rotateOnAxis(lm,t);}rotateZ(t){return this.rotateOnAxis(cm,t);}translateOnAxis(t,e){return rm.copy(t).applyQuaternion(this.quaternion),this.position.add(rm.multiplyScalar(e)),this;}translateX(t){return this.translateOnAxis(am,t);}translateY(t){return this.translateOnAxis(lm,t);}translateZ(t){return this.translateOnAxis(cm,t);}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld);}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bn.copy(this.matrixWorld).invert());}lookAt(t,e,i){t.isVector3?_c.copy(t):_c.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ga.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(Ga,_c,this.up):Bn.lookAt(_c,Ga,this.up),this.quaternion.setFromRotationMatrix(Bn),s&&(Bn.extractRotation(s.matrixWorld),Fr.setFromRotationMatrix(Bn),this.quaternion.premultiply(Fr.invert()));}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this;}return t===this?(Threeerror("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(hm),Nr.child=t,this.dispatchEvent(Nr),Nr.child=null):Threeerror("Object3D.add: object not an instance of THREE.Object3D.",t),this);}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this;}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(q_),Gu.child=t,this.dispatchEvent(Gu),Gu.child=null),this;}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this;}clear(){return this.remove(...this.children);}attach(t){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(hm),Nr.child=t,this.dispatchEvent(Nr),Nr.child=null,this;}getObjectById(t){return this.getObjectByProperty("id",t);}getObjectByName(t){return this.getObjectByProperty("name",t);}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o;}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let n=0,o=s.length;n<o;n++)s[n].getObjectsByProperty(t,e,i);return i;}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld);}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ga,t,H_),t;}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ga,W_,t),t;}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize();}raycast(){}intersectsFrustum(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t);}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t);}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t));}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,s=t.z,n=this.matrix.elements;n[12]+=e-n[0]*e-n[4]*i-n[8]*s,n[13]+=i-n[1]*e-n[5]*i-n[9]*s,n[14]+=s-n[2]*e-n[6]*i-n[10]*s;}this.matrixWorldNeedsUpdate=!0;}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t);}updateWorldMatrix(t,e,i=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const n=this.children;for(let o=0,a=n.length;o<a;o++)n[o].updateWorldMatrix(!1,!0,i);}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function n(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid;}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=n(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];n(t.shapes,f);}else n(t.shapes,l);}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(n(t.materials,this.material[l]));s.material=a;}else s.material=n(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object);}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(n(t.animations,l));}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),p=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p);}return i.object=s,i;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h);}return l;}}clone(t){return new this.constructor().copy(this,t);}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone());}return this;}dispose(){this.dispatchEvent({type:"dispose"});}}ThreeObject3D.DEFAULT_UP=new ThreeVector3(0,1,0);ThreeObject3D.DEFAULT_MATRIX_AUTO_UPDATE=!0;ThreeObject3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ThreeGroup extends ThreeObject3D{constructor(){super(),this.isGroup=!0,this.type="Group";}}const X_={type:"move"};class ThreeWebXRController{constructor(){this._targetRay=null,this._grip=null,this._hand=null;}getHandSpace(){return this._hand===null&&(this._hand=new ThreeGroup(),this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand;}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ThreeGroup(),this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new ThreeVector3(),this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new ThreeVector3()),this._targetRay;}getGripSpace(){return this._grip===null&&(this._grip=new ThreeGroup(),this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new ThreeVector3(),this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new ThreeVector3(),this._grip.eventsEnabled=!1),this._grip;}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this;}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i);}return this.dispatchEvent({type:"connected",data:t}),this;}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this;}update(t,e,i){let s=null,n=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),x=this._getHandJoint(c,v);g!==null&&(x.matrix.fromArray(g.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=g.radius),x.visible=g!==null;}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}));}else l!==null&&t.gripSpace&&(n=e.getPose(t.gripSpace,i),n!==null&&(l.matrix.fromArray(n.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,n.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(n.linearVelocity)):l.hasLinearVelocity=!1,n.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(n.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&n!==null&&(s=n),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(X_)));}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=n!==null),c!==null&&(c.visible=o!==null),this;}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ThreeGroup();i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i);}return t.joints[e.jointName];}}const bx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};const mo={h:0,s:0,l:0};const bc={h:0,s:0,l:0};function Hu(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r;}class ThreeColor{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i);}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s);}else this.setRGB(t,e,i);return this;}setScalar(t){return this.r=t,this.g=t,this.b=t,this;}setHex(t,e=ThreeSRGBColorSpace){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ThreeColorManagement.colorSpaceToWorking(this,e),this;}setRGB(t,e,i,s=ThreeColorManagement.workingColorSpace){return this.r=t,this.g=e,this.b=i,ThreeColorManagement.colorSpaceToWorking(this,s),this;}setHSL(t,e,i,s=ThreeColorManagement.workingColorSpace){if(t=np(t,1),e=ge(e,0,1),i=ge(i,0,1),e===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+e):i+e-i*e,o=2*i-n;this.r=Hu(o,n,t+1/3),this.g=Hu(o,n,t),this.b=Hu(o,n,t-1/3);}return ThreeColorManagement.colorSpaceToWorking(this,s),this;}setStyle(t,e=ThreeSRGBColorSpace){function i(n){n!==void 0&&parseFloat(n)<1&&Threewarn("Color: Alpha component of "+t+" will be ignored.");}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let n;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,parseInt(n[3],10))/255,e);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(n[4]),this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,e);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,e);break;default:Threewarn("Color: Unknown color model "+t);}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const n=s[1],o=n.length;if(o===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(n,16),e);Threewarn("Color: Invalid hex color "+t);}else if(t&&t.length>0)return this.setColorName(t,e);return this;}setColorName(t,e=ThreeSRGBColorSpace){const i=bx[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Threewarn("Color: Unknown color "+t),this;}clone(){return new this.constructor(this.r,this.g,this.b);}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this;}copySRGBToLinear(t){return this.r=io(t.r),this.g=io(t.g),this.b=io(t.b),this;}copyLinearToSRGB(t){return this.r=xa(t.r),this.g=xa(t.g),this.b=xa(t.b),this;}convertSRGBToLinear(){return this.copySRGBToLinear(this),this;}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this;}getHex(t=ThreeSRGBColorSpace){return ThreeColorManagement.workingToColorSpace(Yi.copy(this),t),Math.round(ge(Yi.r*255,0,255))*65536+Math.round(ge(Yi.g*255,0,255))*256+Math.round(ge(Yi.b*255,0,255));}getHexString(t=ThreeSRGBColorSpace){return("000000"+this.getHex(t).toString(16)).slice(-6);}getHSL(t,e=ThreeColorManagement.workingColorSpace){ThreeColorManagement.workingToColorSpace(Yi.copy(this),e);const i=Yi.r,s=Yi.g,n=Yi.b,o=Math.max(i,s,n),a=Math.min(i,s,n);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case i:l=(s-n)/f+(s<n?6:0);break;case s:l=(n-i)/f+2;break;case n:l=(i-s)/f+4;break;}l/=6;}return t.h=l,t.s=c,t.l=h,t;}getRGB(t,e=ThreeColorManagement.workingColorSpace){return ThreeColorManagement.workingToColorSpace(Yi.copy(this),e),t.r=Yi.r,t.g=Yi.g,t.b=Yi.b,t;}getStyle(t=ThreeSRGBColorSpace){ThreeColorManagement.workingToColorSpace(Yi.copy(this),t);const e=Yi.r,i=Yi.g,s=Yi.b;return t!==ThreeSRGBColorSpace?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`;}offsetHSL(t,e,i){return this.getHSL(mo),this.setHSL(mo.h+t,mo.s+e,mo.l+i);}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this;}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this;}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this;}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this;}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this;}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this;}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this;}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this;}lerpHSL(t,e){this.getHSL(mo),t.getHSL(bc);const i=Pl(mo.h,bc.h,e),s=Pl(mo.s,bc.s,e),n=Pl(mo.l,bc.l,e);return this.setHSL(i,s,n),this;}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this;}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,n=t.elements;return this.r=n[0]*e+n[3]*i+n[6]*s,this.g=n[1]*e+n[4]*i+n[7]*s,this.b=n[2]*e+n[5]*i+n[8]*s,this;}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b;}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this;}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t;}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this;}toJSON(){return this.getHex();}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b;}}const Yi=new ThreeColor();ThreeColor.NAMES=bx;class ThreeFogExp2{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new ThreeColor(t),this.density=e;}clone(){return new ThreeFogExp2(this.color,this.density);}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density};}}let ThreeFog=class Sx{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new ThreeColor(t),this.near=e,this.far=i;}clone(){return new Sx(this.color,this.near,this.far);}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far};}};class ThreeScene extends ThreeObject3D{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ThreeEuler(),this.environmentIntensity=1,this.environmentRotation=new ThreeEuler(),this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}));}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this;}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e;}}const Ys=new ThreeVector3();const Vn=new ThreeVector3();const Wu=new ThreeVector3();const Gn=new ThreeVector3();const Ur=new ThreeVector3();const Or=new ThreeVector3();const um=new ThreeVector3();const qu=new ThreeVector3();const Xu=new ThreeVector3();const Yu=new ThreeVector3();const $u=new ThreeVector4();const Zu=new ThreeVector4();const ju=new ThreeVector4();class ThreeTriangle{constructor(t=new ThreeVector3(),e=new ThreeVector3(),i=new ThreeVector3()){this.a=t,this.b=e,this.c=i;}static getNormal(t,e,i,s){s.subVectors(i,e),Ys.subVectors(t,e),s.cross(Ys);const n=s.lengthSq();return n>0?s.multiplyScalar(1/Math.sqrt(n)):s.set(0,0,0);}static getBarycoord(t,e,i,s,n){Ys.subVectors(s,e),Vn.subVectors(i,e),Wu.subVectors(t,e);const o=Ys.dot(Ys),a=Ys.dot(Vn),l=Ys.dot(Wu),c=Vn.dot(Vn),h=Vn.dot(Wu),f=o*c-a*a;if(f===0)return n.set(0,0,0),null;const u=1/f,d=(c*l-a*h)*u,p=(o*h-a*l)*u;return n.set(1-d-p,p,d);}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1;}static getInterpolation(t,e,i,s,n,o,a,l){return this.getBarycoord(t,e,i,s,Gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,Gn.x),l.addScaledVector(o,Gn.y),l.addScaledVector(a,Gn.z),l);}static getInterpolatedAttribute(t,e,i,s,n,o){return $u.setScalar(0),Zu.setScalar(0),ju.setScalar(0),$u.fromBufferAttribute(t,e),Zu.fromBufferAttribute(t,i),ju.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector($u,n.x),o.addScaledVector(Zu,n.y),o.addScaledVector(ju,n.z),o;}static isFrontFacing(t,e,i,s){return Ys.subVectors(i,e),Vn.subVectors(t,e),Ys.cross(Vn).dot(s)<0;}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this;}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this;}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this;}clone(){return new this.constructor().copy(this);}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this;}getArea(){return Ys.subVectors(this.c,this.b),Vn.subVectors(this.a,this.b),Ys.cross(Vn).length()*.5;}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3);}getNormal(t){return ThreeTriangle.getNormal(this.a,this.b,this.c,t);}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c);}getBarycoord(t,e){return ThreeTriangle.getBarycoord(t,this.a,this.b,this.c,e);}getInterpolation(t,e,i,s,n){return ThreeTriangle.getInterpolation(t,this.a,this.b,this.c,e,i,s,n);}containsPoint(t){return ThreeTriangle.containsPoint(t,this.a,this.b,this.c);}isFrontFacing(t){return ThreeTriangle.isFrontFacing(this.a,this.b,this.c,t);}intersectsBox(t){return t.intersectsTriangle(this);}closestPointToPoint(t,e){const i=this.a,s=this.b,n=this.c;let o,a;Ur.subVectors(s,i),Or.subVectors(n,i),qu.subVectors(t,i);const l=Ur.dot(qu),c=Or.dot(qu);if(l<=0&&c<=0)return e.copy(i);Xu.subVectors(t,s);const h=Ur.dot(Xu),f=Or.dot(Xu);if(h>=0&&f<=h)return e.copy(s);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Ur,o);Yu.subVectors(t,n);const d=Ur.dot(Yu),p=Or.dot(Yu);if(p>=0&&d<=p)return e.copy(n);const v=d*c-l*p;if(v<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(i).addScaledVector(Or,a);const g=h*p-d*f;if(g<=0&&f-h>=0&&d-p>=0)return um.subVectors(n,s),a=(f-h)/(f-h+(d-p)),e.copy(s).addScaledVector(um,a);const x=1/(g+v+u);return o=v*x,a=u*x,e.copy(i).addScaledVector(Ur,o).addScaledVector(Or,a);}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c);}}class ThreeBox3{constructor(t=new ThreeVector3(1/0,1/0,1/0),e=new ThreeVector3(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e;}set(t,e){return this.min.copy(t),this.max.copy(e),this;}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint($s.fromArray(t,e));return this;}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint($s.fromBufferAttribute(t,e));return this;}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this;}setFromCenterAndSize(t,e){const i=$s.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this;}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e);}clone(){return new this.constructor().copy(this);}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this;}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this;}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z;}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5);}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min);}expandByPoint(t){return this.min.min(t),this.max.max(t),this;}expandByVector(t){return this.min.sub(t),this.max.add(t),this;}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this;}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const n=i.getAttribute("position");if(e===!0&&n!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=n.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,$s):$s.fromBufferAttribute(n,o),$s.applyMatrix4(t.matrixWorld),this.expandByPoint($s);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Mc.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Mc.copy(i.boundingBox)),Mc.applyMatrix4(t.matrixWorld),this.union(Mc);}const s=t.children;for(let n=0,o=s.length;n<o;n++)this.expandByObject(s[n],e);return this;}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z;}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z;}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z));}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z;}intersectsSphere(t){return this.clampPoint(t.center,$s),$s.distanceToSquared(t.center)<=t.radius*t.radius;}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant;}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ha),Sc.subVectors(this.max,Ha),Br.subVectors(t.a,Ha),Vr.subVectors(t.b,Ha),Gr.subVectors(t.c,Ha),go.subVectors(Vr,Br),vo.subVectors(Gr,Vr),Bo.subVectors(Br,Gr);let e=[0,-go.z,go.y,0,-vo.z,vo.y,0,-Bo.z,Bo.y,go.z,0,-go.x,vo.z,0,-vo.x,Bo.z,0,-Bo.x,-go.y,go.x,0,-vo.y,vo.x,0,-Bo.y,Bo.x,0];return!Ku(e,Br,Vr,Gr,Sc)||(e=[1,0,0,0,1,0,0,0,1],!Ku(e,Br,Vr,Gr,Sc))?!1:(Ac.crossVectors(go,vo),e=[Ac.x,Ac.y,Ac.z],Ku(e,Br,Vr,Gr,Sc));}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max);}distanceToPoint(t){return this.clampPoint(t,$s).distanceTo(t);}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize($s).length()*.5),t;}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this;}union(t){return this.min.min(t.min),this.max.max(t.max),this;}applyMatrix4(t){return this.isEmpty()?this:(Hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Hn),this);}translate(t){return this.min.add(t),this.max.add(t),this;}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max);}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()};}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this;}}const Hn=[new ThreeVector3(),new ThreeVector3(),new ThreeVector3(),new ThreeVector3(),new ThreeVector3(),new ThreeVector3(),new ThreeVector3(),new ThreeVector3()];const $s=new ThreeVector3();const Mc=new ThreeBox3();const Br=new ThreeVector3();const Vr=new ThreeVector3();const Gr=new ThreeVector3();const go=new ThreeVector3();const vo=new ThreeVector3();const Bo=new ThreeVector3();const Ha=new ThreeVector3();const Sc=new ThreeVector3();const Ac=new ThreeVector3();const Vo=new ThreeVector3();function Ku(r,t,e,i,s){for(let n=0,o=r.length-3;n<=o;n+=3){Vo.fromArray(r,n);const a=s.x*Math.abs(Vo.x)+s.y*Math.abs(Vo.y)+s.z*Math.abs(Vo.z),l=t.dot(Vo),c=e.dot(Vo),h=i.dot(Vo);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1;}return!0;}const Jn=Y_();function Y_(){const r=new ArrayBuffer(4),t=new Float32Array(r),e=new Uint32Array(r),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13);}const n=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,n[l]=c|h;}for(let l=1024;l<2048;++l)n[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:i,shiftTable:s,mantissaTable:n,exponentTable:o,offsetTable:a};}function vs(r){Math.abs(r)>65504&&Threewarn("DataUtils.toHalfFloat(): Value out of range."),r=ge(r,-65504,65504),Jn.floatView[0]=r;const t=Jn.uint32View[0],e=t>>23&511;return Jn.baseTable[e]+((t&8388607)>>Jn.shiftTable[e]);}function gl(r){const t=r>>10;return Jn.uint32View[0]=Jn.mantissaTable[Jn.offsetTable[t]+(r&1023)]+Jn.exponentTable[t],Jn.floatView[0];}class ThreeDataUtils{static toHalfFloat(t){return vs(t);}static fromHalfFloat(t){return gl(t);}}const xi=new ThreeVector3();const Tc=new ThreeVector2();let $_=0;class ThreeBufferAttribute extends ThreeEventDispatcher{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:$_++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=ThreeStaticDrawUsage,this.updateRanges=[],this.gpuType=ThreeFloatType,this.version=0;}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++;}setUsage(t){return this.usage=t,this;}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e});}clearUpdateRanges(){this.updateRanges.length=0;}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this;}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,n=this.itemSize;s<n;s++)this.array[t+s]=e.array[i+s];return this;}copyArray(t){return this.array.set(t),this;}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Tc.fromBufferAttribute(this,e),Tc.applyMatrix3(t),this.setXY(e,Tc.x,Tc.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)xi.fromBufferAttribute(this,e),xi.applyMatrix3(t),this.setXYZ(e,xi.x,xi.y,xi.z);return this;}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)xi.fromBufferAttribute(this,e),xi.applyMatrix4(t),this.setXYZ(e,xi.x,xi.y,xi.z);return this;}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)xi.fromBufferAttribute(this,e),xi.applyNormalMatrix(t),this.setXYZ(e,xi.x,xi.y,xi.z);return this;}transformDirection(t){for(let e=0,i=this.count;e<i;e++)xi.fromBufferAttribute(this,e),xi.transformDirection(t),this.setXYZ(e,xi.x,xi.y,xi.z);return this;}set(t,e=0){return this.array.set(t,e),this;}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=cs(i,this.array)),i;}setComponent(t,e,i){return this.normalized&&(i=_e(i,this.array)),this.array[t*this.itemSize+e]=i,this;}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=cs(e,this.array)),e;}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this;}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=cs(e,this.array)),e;}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this;}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=cs(e,this.array)),e;}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this;}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=cs(e,this.array)),e;}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this;}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this;}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this;}setXYZW(t,e,i,s,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=n,this;}onUpload(t){return this.onUploadCallback=t,this;}clone(){return new this.constructor(this.array,this.itemSize).copy(this);}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t;}dispose(){this.dispatchEvent({type:"dispose"});}}class ThreeInt8BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Int8Array(t),e,i);}}class ThreeUint8BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Uint8Array(t),e,i);}}class ThreeUint8ClampedBufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Uint8ClampedArray(t),e,i);}}class ThreeInt16BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Int16Array(t),e,i);}}class ThreeUint16BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Uint16Array(t),e,i);}}class ThreeInt32BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Int32Array(t),e,i);}}class ThreeUint32BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Uint32Array(t),e,i);}}class ThreeFloat16BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Uint16Array(t),e,i),this.isFloat16BufferAttribute=!0;}getX(t){let e=gl(this.array[t*this.itemSize]);return this.normalized&&(e=cs(e,this.array)),e;}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=vs(e),this;}getY(t){let e=gl(this.array[t*this.itemSize+1]);return this.normalized&&(e=cs(e,this.array)),e;}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=vs(e),this;}getZ(t){let e=gl(this.array[t*this.itemSize+2]);return this.normalized&&(e=cs(e,this.array)),e;}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=vs(e),this;}getW(t){let e=gl(this.array[t*this.itemSize+3]);return this.normalized&&(e=cs(e,this.array)),e;}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=vs(e),this;}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array)),this.array[t+0]=vs(e),this.array[t+1]=vs(i),this;}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array)),this.array[t+0]=vs(e),this.array[t+1]=vs(i),this.array[t+2]=vs(s),this;}setXYZW(t,e,i,s,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array),n=_e(n,this.array)),this.array[t+0]=vs(e),this.array[t+1]=vs(i),this.array[t+2]=vs(s),this.array[t+3]=vs(n),this;}}class ThreeFloat32BufferAttribute extends ThreeBufferAttribute{constructor(t,e,i){super(new Float32Array(t),e,i);}}const e2=new ThreeBox3();const Wa=new ThreeVector3();const Ju=new ThreeVector3();class ThreeSphere{constructor(t=new ThreeVector3(),e=-1){this.isSphere=!0,this.center=t,this.radius=e;}set(t,e){return this.center.copy(t),this.radius=e,this;}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):e2.setFromPoints(t).getCenter(i);let s=0;for(let n=0,o=t.length;n<o;n++)s=Math.max(s,i.distanceToSquared(t[n]));return this.radius=Math.sqrt(s),this;}copy(t){return this.center.copy(t.center),this.radius=t.radius,this;}isEmpty(){return this.radius<0;}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this;}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius;}distanceToPoint(t){return t.distanceTo(this.center)-this.radius;}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e;}intersectsBox(t){return t.intersectsSphere(this);}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius;}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e;}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t);}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this;}translate(t){return this.center.add(t),this;}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Wa.subVectors(t,this.center);const e=Wa.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Wa,s/i),this.radius+=s;}return this;}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ju.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Wa.copy(t.center).add(Ju)),this.expandByPoint(Wa.copy(t.center).sub(Ju))),this);}equals(t){return t.center.equals(this.center)&&t.radius===this.radius;}clone(){return new this.constructor().copy(this);}toJSON(){return{radius:this.radius,center:this.center.toArray()};}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this;}}let i2=0;const Is=new ThreeMatrix4();const Qu=new ThreeObject3D();const Hr=new ThreeVector3();const Ms=new ThreeBox3();const qa=new ThreeBox3();const Li=new ThreeVector3();class ThreeBufferGeometry extends ThreeEventDispatcher{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:i2++}),this.uuid=Rs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1;}getIndex(){return this.index;}setIndex(t){return Array.isArray(t)?this.index=new(f_(t)?ThreeUint32BufferAttribute:ThreeUint16BufferAttribute)(t,1):this.index=t,this;}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this;}getIndirect(){return this.indirect;}getAttribute(t){return this.attributes[t];}setAttribute(t,e){return this.attributes[t]=e,this;}deleteAttribute(t){return delete this.attributes[t],this;}hasAttribute(t){return this.attributes[t]!==void 0;}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i});}clearGroups(){this.groups=[];}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e;}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new ThreeMatrix3().getNormalMatrix(t);i.applyNormalMatrix(n),i.needsUpdate=!0;}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this;}applyQuaternion(t){return Is.makeRotationFromQuaternion(t),this.applyMatrix4(Is),this;}rotateX(t){return Is.makeRotationX(t),this.applyMatrix4(Is),this;}rotateY(t){return Is.makeRotationY(t),this.applyMatrix4(Is),this;}rotateZ(t){return Is.makeRotationZ(t),this.applyMatrix4(Is),this;}translate(t,e,i){return Is.makeTranslation(t,e,i),this.applyMatrix4(Is),this;}scale(t,e,i){return Is.makeScale(t,e,i),this.applyMatrix4(Is),this;}lookAt(t){return Qu.lookAt(t),Qu.updateMatrix(),this.applyMatrix4(Qu.matrix),this;}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hr).negate(),this.translate(Hr.x,Hr.y,Hr.z),this;}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,n=t.length;s<n;s++){const o=t[s];i.push(o.x,o.y,o.z||0);}this.setAttribute("position",new ThreeFloat32BufferAttribute(i,3));}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const n=t[s];e.setXYZ(s,n.x,n.y,n.z||0);}t.length>e.count&&Threewarn("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0;}return this;}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ThreeBox3());const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Threeerror("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new ThreeVector3(-1/0,-1/0,-1/0),new ThreeVector3(1/0,1/0,1/0));return;}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const n=e[i];Ms.setFromBufferAttribute(n),this.morphTargetsRelative?(Li.addVectors(this.boundingBox.min,Ms.min),this.boundingBox.expandByPoint(Li),Li.addVectors(this.boundingBox.max,Ms.max),this.boundingBox.expandByPoint(Li)):(this.boundingBox.expandByPoint(Ms.min),this.boundingBox.expandByPoint(Ms.max));}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Threeerror('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this);}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ThreeSphere());const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Threeerror("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new ThreeVector3(),1/0);return;}if(t){const i=this.boundingSphere.center;if(Ms.setFromBufferAttribute(t),e)for(let n=0,o=e.length;n<o;n++){const a=e[n];qa.setFromBufferAttribute(a),this.morphTargetsRelative?(Li.addVectors(Ms.min,qa.min),Ms.expandByPoint(Li),Li.addVectors(Ms.max,qa.max),Ms.expandByPoint(Li)):(Ms.expandByPoint(qa.min),Ms.expandByPoint(qa.max));}Ms.getCenter(i);let s=0;for(let n=0,o=t.count;n<o;n++)Li.fromBufferAttribute(t,n),s=Math.max(s,i.distanceToSquared(Li));if(e)for(let n=0,o=e.length;n<o;n++){const a=e[n],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Li.fromBufferAttribute(a,c),l&&(Hr.fromBufferAttribute(t,c),Li.add(Hr)),s=Math.max(s,i.distanceToSquared(Li));}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Threeerror('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this);}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Threeerror("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return;}const i=e.position,s=e.normal,n=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new ThreeBufferAttribute(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));const a=[],l=[];for(let b=0;b<i.count;b++)a[b]=new ThreeVector3(),l[b]=new ThreeVector3();const c=new ThreeVector3(),h=new ThreeVector3(),f=new ThreeVector3(),u=new ThreeVector2(),d=new ThreeVector2(),p=new ThreeVector2(),v=new ThreeVector3(),g=new ThreeVector3();function x(b,S,E){c.fromBufferAttribute(i,b),h.fromBufferAttribute(i,S),f.fromBufferAttribute(i,E),u.fromBufferAttribute(n,b),d.fromBufferAttribute(n,S),p.fromBufferAttribute(n,E),h.sub(c),f.sub(c),d.sub(u),p.sub(u);const T=1/(d.x*p.y-p.x*d.y);isFinite(T)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(T),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(T),a[b].add(v),a[S].add(v),a[E].add(v),l[b].add(g),l[S].add(g),l[E].add(g));}let m=this.groups;m.length===0&&(m=[{start:0,count:t.count}]);for(let b=0,S=m.length;b<S;++b){const E=m[b],T=E.start,R=E.count;for(let z=T,L=T+R;z<L;z+=3)x(t.getX(z+0),t.getX(z+1),t.getX(z+2));}const w=new ThreeVector3(),y=new ThreeVector3(),_=new ThreeVector3(),M=new ThreeVector3();function A(b){_.fromBufferAttribute(s,b),M.copy(_);const S=a[b];w.copy(S),w.sub(_.multiplyScalar(_.dot(S))).normalize(),y.crossVectors(M,S);const T=y.dot(l[b])<0?-1:1;o.setXYZW(b,w.x,w.y,w.z,T);}for(let b=0,S=m.length;b<S;++b){const E=m[b],T=E.start,R=E.count;for(let z=T,L=T+R;z<L;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2));}this._transformed=!0;}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new ThreeBufferAttribute(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const s=new ThreeVector3(),n=new ThreeVector3(),o=new ThreeVector3(),a=new ThreeVector3(),l=new ThreeVector3(),c=new ThreeVector3(),h=new ThreeVector3(),f=new ThreeVector3();if(t)for(let u=0,d=t.count;u<d;u+=3){const p=t.getX(u+0),v=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,p),n.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,n),f.subVectors(s,n),h.cross(f),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),a.add(h),l.add(h),c.add(h),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z);}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),n.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,n),f.subVectors(s,n),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0;}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Li.fromBufferAttribute(t,e),Li.normalize(),t.setXYZ(e,Li.x,Li.y,Li.z);}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h);let d=0,p=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?d=l[v]*a.data.stride+a.offset:d=l[v]*h;for(let x=0;x<h;x++)u[p++]=c[d++];}return new ThreeBufferAttribute(u,h,f);}if(this.index===null)return Threewarn("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ThreeBufferGeometry(),i=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,i);e.setAttribute(a,c);}const n=this.morphAttributes;for(const a in n){const l=[],c=n[a];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,i);l.push(d);}e.morphAttributes[a]=l;}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex);}return e;}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t;}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data);}const s={};let n=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data));}h.length>0&&(s[l]=h,n=!0);}n&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t;}clone(){return new this.constructor().copy(this);}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e));}const n=t.morphAttributes;for(const c in n){const h=[],f=n[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h;}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex);}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this;}dispose(){this.dispatchEvent({type:"dispose"});}}class ThreeInterleavedBuffer{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ThreeStaticDrawUsage,this.updateRanges=[],this.version=0,this.uuid=Rs();}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++;}setUsage(t){return this.usage=t,this;}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e});}clearUpdateRanges(){this.updateRanges.length=0;}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this;}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,n=this.stride;s<n;s++)this.array[t+s]=e.array[i+s];return this;}set(t,e=0){return this.array.set(t,e),this;}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rs()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i;}onUpload(t){return this.onUploadCallback=t,this;}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rs()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e;}}const es=new ThreeVector3();class ThreeInterleavedBufferAttribute{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s;}get count(){return this.data.count;}get array(){return this.data.array;}set needsUpdate(t){this.data.needsUpdate=t;}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)es.fromBufferAttribute(this,e),es.applyMatrix4(t),this.setXYZ(e,es.x,es.y,es.z);return this;}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)es.fromBufferAttribute(this,e),es.applyNormalMatrix(t),this.setXYZ(e,es.x,es.y,es.z);return this;}transformDirection(t){for(let e=0,i=this.count;e<i;e++)es.fromBufferAttribute(this,e),es.transformDirection(t),this.setXYZ(e,es.x,es.y,es.z);return this;}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=cs(i,this.array)),i;}setComponent(t,e,i){return this.normalized&&(i=_e(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this;}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this;}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this;}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this;}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this;}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=cs(e,this.array)),e;}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=cs(e,this.array)),e;}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=cs(e,this.array)),e;}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=cs(e,this.array)),e;}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this;}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this;}setXYZW(t,e,i,s,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=n,this;}clone(t){if(t===void 0){Threelog("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)e.push(this.data.array[s+n]);}return new ThreeBufferAttribute(new this.array.constructor(e),this.itemSize,this.normalized);}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ThreeInterleavedBufferAttribute(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized);}toJSON(t){if(t===void 0){Threelog("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)e.push(this.data.array[s+n]);}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized};}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized};}}const tf=new ThreeVector3();const s2=new ThreeVector3();const n2=new ThreeMatrix3();class ThreePlane{constructor(t=new ThreeVector3(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e;}set(t,e){return this.normal.copy(t),this.constant=e,this;}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this;}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this;}setFromCoplanarPoints(t,e,i){const s=tf.subVectors(i,e).cross(s2.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this;}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this;}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this;}negate(){return this.constant*=-1,this.normal.negate(),this;}distanceToPoint(t){return this.normal.dot(t)+this.constant;}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius;}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t));}intersectLine(t,e,i=!0){const s=t.delta(tf),n=this.normal.dot(s);if(n===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/n;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o);}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0;}intersectsBox(t){return t.intersectsPlane(this);}intersectsSphere(t){return t.intersectsPlane(this);}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant);}applyMatrix4(t,e){const i=e||n2.getNormalMatrix(t),s=this.coplanarPoint(tf).applyMatrix4(t),n=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(n),this;}translate(t){return this.constant-=t.dot(this.normal),this;}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant;}clone(){return new this.constructor().copy(this);}toJSON(){return{normal:this.normal.toArray(),constant:this.constant};}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this;}}let o2=0;class ThreeMaterial extends ThreeEventDispatcher{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:o2++}),this.uuid=Rs(),this.name="",this.type="Material",this.blending=ThreeNormalBlending,this.side=ThreeFrontSide,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ThreeSrcAlphaFactor,this.blendDst=ThreeOneMinusSrcAlphaFactor,this.blendEquation=ThreeAddEquation,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ThreeColor(0,0,0),this.blendAlpha=0,this.depthFunc=ThreeLessEqualDepth,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ThreeAlwaysStencilFunc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ThreeKeepStencilOp,this.stencilZFail=ThreeKeepStencilOp,this.stencilZPass=ThreeKeepStencilOp,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0;}get alphaTest(){return this._alphaTest;}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t;}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString();}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Threewarn(`Material: parameter '${e}' has value of undefined.`);continue;}const s=this[e];if(s===void 0){Threewarn(`Material: '${e}' is not a property of THREE.${this.type}.`);continue;}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i;}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(n=>n.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(n){const o=[];for(const a in n){const l=n[a];delete l.metadata,o.push(l);}return o;}if(e){const n=s(t.textures),o=s(t.images);n.length>0&&(i.textures=n),o.length>0&&(i.images=o);}return i;}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ThreeColor().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new ThreePlane().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ThreeVector2().fromArray(i);}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ThreeVector2().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this;}clone(){return new this.constructor().copy(this);}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let n=0;n!==s;++n)i[n]=e[n].clone();}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this;}dispose(){this.dispatchEvent({type:"dispose"});}set needsUpdate(t){t===!0&&this.version++;}}class ThreeSpriteMaterial extends ThreeMaterial{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ThreeColor(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this;}}let Wr;const Xa=new ThreeVector3();const qr=new ThreeVector3();const Xr=new ThreeVector3();const Yr=new ThreeVector2();const Ya=new ThreeVector2();const Tx=new ThreeMatrix4();const Ec=new ThreeVector3();const $a=new ThreeVector3();const Cc=new ThreeVector3();const fm=new ThreeVector2();const ef=new ThreeVector2();const dm=new ThreeVector2();class ThreeSprite extends ThreeObject3D{constructor(t=new ThreeSpriteMaterial()){if(super(),this.isSprite=!0,this.type="Sprite",Wr===void 0){Wr=new ThreeBufferGeometry();const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new ThreeInterleavedBuffer(e,5);Wr.setIndex([0,1,2,0,2,3]),Wr.setAttribute("position",new ThreeInterleavedBufferAttribute(i,3,0,!1)),Wr.setAttribute("uv",new ThreeInterleavedBufferAttribute(i,2,3,!1));}this.geometry=Wr,this.material=t,this.center=new ThreeVector2(.5,.5),this.count=1;}intersectsFrustum(t){return t.intersectsSprite(this);}raycast(t,e){t.camera===null&&Threeerror('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),qr.setFromMatrixScale(this.matrixWorld),Tx.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Xr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qr.multiplyScalar(-Xr.z);const i=this.material.rotation;let s,n;i!==0&&(n=Math.cos(i),s=Math.sin(i));const o=this.center;Rc(Ec.set(-.5,-.5,0),Xr,o,qr,s,n),Rc($a.set(.5,-.5,0),Xr,o,qr,s,n),Rc(Cc.set(.5,.5,0),Xr,o,qr,s,n),fm.set(0,0),ef.set(1,0),dm.set(1,1);let a=t.ray.intersectTriangle(Ec,$a,Cc,!1,Xa);if(a===null&&(Rc($a.set(-.5,.5,0),Xr,o,qr,s,n),ef.set(0,1),a=t.ray.intersectTriangle(Ec,Cc,$a,!1,Xa),a===null))return;const l=t.ray.origin.distanceTo(Xa);l<t.near||l>t.far||e.push({distance:l,point:Xa.clone(),uv:ThreeTriangle.getInterpolation(Xa,Ec,$a,Cc,fm,ef,dm,new ThreeVector2()),face:null,object:this});}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this;}}function Rc(r,t,e,i,s,n){Yr.subVectors(r,e).addScalar(.5).multiply(i),s!==void 0?(Ya.x=n*Yr.x-s*Yr.y,Ya.y=s*Yr.x+n*Yr.y):Ya.copy(Yr),r.copy(t),r.x+=Ya.x,r.y+=Ya.y,r.applyMatrix4(Tx);}const zc=new ThreeVector3();const pm=new ThreeVector3();class ThreeLOD extends ThreeObject3D{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0;}copy(t){super.copy(t,!1);const e=t.levels;for(let i=0,s=e.length;i<s;i++){const n=e[i];this.addLevel(n.object.clone(),n.distance,n.hysteresis);}return this.autoUpdate=t.autoUpdate,this;}addLevel(t,e=0,i=0){e=Math.abs(e);const s=this.levels;let n;for(n=0;n<s.length&&!(e<s[n].distance);n++);return s.splice(n,0,{distance:e,hysteresis:i,object:t}),this.add(t),this;}removeLevel(t){const e=this.levels;for(let i=0;i<e.length;i++)if(e[i].distance===t){const s=e.splice(i,1);return this.remove(s[0].object),!0;}return!1;}getCurrentLevel(){return this._currentLevel;}getObjectForDistance(t){const e=this.levels;if(e.length>0){let i,s;for(i=1,s=e.length;i<s;i++){let n=e[i].distance;if(e[i].object.visible&&(n-=n*e[i].hysteresis),t<n)break;}return e[i-1].object;}return null;}raycast(t,e){if(this.levels.length>0){zc.setFromMatrixPosition(this.matrixWorld);const s=t.ray.origin.distanceTo(zc);this.getObjectForDistance(s).raycast(t,e);}}update(t){const e=this.levels;if(e.length>1){zc.setFromMatrixPosition(t.matrixWorld),pm.setFromMatrixPosition(this.matrixWorld);const i=zc.distanceTo(pm)/t.zoom;e[0].object.visible=!0;let s,n;for(s=1,n=e.length;s<n;s++){let o=e[s].distance;if(e[s].object.visible&&(o-=o*e[s].hysteresis),i>=o)e[s-1].object.visible=!1,e[s].object.visible=!0;else break;}for(this._currentLevel=s-1;s<n;s++)e[s].object.visible=!1;}}toJSON(t){const e=super.toJSON(t);e.object.autoUpdate=this.autoUpdate,e.object.levels=[];const i=this.levels;for(let s=0,n=i.length;s<n;s++){const o=i[s];e.object.levels.push({object:o.object.uuid,distance:o.distance,hysteresis:o.hysteresis});}return e;}}const Wn=new ThreeVector3();const sf=new ThreeVector3();const Pc=new ThreeVector3();const Lc=new ThreeVector3();class ThreeRay{constructor(t=new ThreeVector3(),e=new ThreeVector3(0,0,-1)){this.origin=t,this.direction=e;}set(t,e){return this.origin.copy(t),this.direction.copy(e),this;}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this;}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t);}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this;}recast(t){return this.origin.copy(this.at(t,Wn)),this;}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i);}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t));}distanceSqToPoint(t){const e=Wn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Wn.copy(this.origin).addScaledVector(this.direction,e),Wn.distanceToSquared(t));}distanceSqToSegment(t,e,i,s){sf.copy(t).add(e).multiplyScalar(.5),Pc.copy(e).sub(t).normalize(),Lc.copy(this.origin).sub(sf);const n=t.distanceTo(e)*.5,o=-this.direction.dot(Pc),a=Lc.dot(this.direction),l=-Lc.dot(Pc),c=Lc.lengthSq(),h=Math.abs(1-o*o);let f,u,d,p;if(h>0){if(f=o*l-a,u=o*a-l,p=n*h,f>=0){if(u>=-p){if(u<=p){const v=1/h;f*=v,u*=v,d=f*(f+o*u+2*a)+u*(o*f+u+2*l)+c;}else u=n,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;}else u=-n,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;}else u<=-p?(f=Math.max(0,-(-o*n+a)),u=f>0?-n:Math.min(Math.max(-n,-l),n),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-n,-l),n),d=u*(u+2*l)+c):(f=Math.max(0,-(o*n+a)),u=f>0?n:Math.min(Math.max(-n,-l),n),d=-f*f+u*(u+2*l)+c);}else u=o>0?-n:n,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(sf).addScaledVector(Pc,u),d;}intersectSphere(t,e){if(t.radius<0)return null;Wn.subVectors(t.center,this.origin);const i=Wn.dot(this.direction),s=Wn.dot(Wn)-i*i,n=t.radius*t.radius;if(s>n)return null;const o=Math.sqrt(n-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e);}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius;}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null;}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e);}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0;}intersectBox(t,e){let i,s,n,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(n=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(n=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),i>o||n>s||((n>i||isNaN(i))&&(i=n),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e);}intersectsBox(t){return this.intersectBox(t,Wn)!==null;}intersectTriangle(t,e,i,s,n){const o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,f=t.x-o.x,u=t.y-o.y,d=t.z-o.z,p=e.x-o.x,v=e.y-o.y,g=e.z-o.z,x=i.x-o.x,m=i.y-o.y,w=i.z-o.z,y=Math.abs(l),_=Math.abs(c),M=Math.abs(h);let A,b,S,E,T,R,z,L,k,U,F,G;if(y>=_&&y>=M?(S=l,R=f,k=p,G=x,l>=0?(A=c,b=h,E=u,T=d,z=v,L=g,U=m,F=w):(A=h,b=c,E=d,T=u,z=g,L=v,U=w,F=m)):_>=M?(S=c,R=u,k=v,G=m,c>=0?(A=h,b=l,E=d,T=f,z=g,L=p,U=w,F=x):(A=l,b=h,E=f,T=d,z=p,L=g,U=x,F=w)):(S=h,R=d,k=g,G=w,h>=0?(A=l,b=c,E=f,T=u,z=p,L=v,U=x,F=m):(A=c,b=l,E=u,T=f,z=v,L=p,U=m,F=x)),S===0)return null;const B=A/S,q=b/S,X=1/S,vt=E-B*R,gt=T-q*R,Qt=z-B*k,te=L-q*k,Zt=U-B*G,J=F-q*G,nt=Zt*te-J*Qt,mt=vt*J-gt*Zt,Y=Qt*gt-te*vt;if(s){if(nt<0||mt<0||Y<0)return null;}else if((nt<0||mt<0||Y<0)&&(nt>0||mt>0||Y>0))return null;const xt=nt+mt+Y;if(xt===0)return null;const yt=X*(nt*R+mt*k+Y*G);return(xt>0?yt<0:yt>0)?null:this.at(yt/xt,n);}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this;}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction);}clone(){return new this.constructor().copy(this);}}class ThreeMeshBasicMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ThreeColor(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ThreeEuler(),this.combine=ThreeMultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this;}}const mm=new ThreeMatrix4();const Go=new ThreeRay();const Ic=new ThreeSphere();const gm=new ThreeVector3();const kc=new ThreeVector3();const Dc=new ThreeVector3();const Fc=new ThreeVector3();const nf=new ThreeVector3();const Nc=new ThreeVector3();const vm=new ThreeVector3();const Uc=new ThreeVector3();class ThreeMesh extends ThreeObject3D{constructor(t=new ThreeBufferGeometry(),e=new ThreeMeshBasicMaterial()){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets();}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this;}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,o=s.length;n<o;n++){const a=s[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n;}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,n=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(n&&a){Nc.set(0,0,0);for(let l=0,c=n.length;l<c;l++){const h=a[l],f=n[l];h!==0&&(nf.fromBufferAttribute(f,t),o?Nc.addScaledVector(nf,h):Nc.addScaledVector(nf.sub(e),h));}e.add(Nc);}return e;}intersectsFrustum(t){return t.intersectsObject(this);}raycast(t,e){const i=this.geometry,s=this.material,n=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ic.copy(i.boundingSphere),Ic.applyMatrix4(n),Go.copy(t.ray).recast(t.near),!(Ic.containsPoint(Go.origin)===!1&&(Go.intersectSphere(Ic,gm)===null||Go.origin.distanceToSquared(gm)>(t.far-t.near)**2))&&(mm.copy(n).invert(),Go.copy(t.ray).applyMatrix4(mm),!(i.boundingBox!==null&&Go.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Go)));}_computeIntersections(t,e,i){let s;const n=this.geometry,o=this.material,a=n.index,l=n.attributes.position,c=n.attributes.uv,h=n.attributes.uv1,f=n.attributes.normal,u=n.groups,d=n.drawRange;if(a!==null){if(Array.isArray(o))for(let p=0,v=u.length;p<v;p++){const g=u[p],x=o[g.materialIndex],m=Math.max(g.start,d.start),w=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let y=m,_=w;y<_;y+=3){const M=a.getX(y),A=a.getX(y+1),b=a.getX(y+2);s=Oc(this,x,t,i,c,h,f,M,A,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s));}}else{const p=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let g=p,x=v;g<x;g+=3){const m=a.getX(g),w=a.getX(g+1),y=a.getX(g+2);s=Oc(this,o,t,i,c,h,f,m,w,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s));}}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,v=u.length;p<v;p++){const g=u[p],x=o[g.materialIndex],m=Math.max(g.start,d.start),w=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let y=m,_=w;y<_;y+=3){const M=y,A=y+1,b=y+2;s=Oc(this,x,t,i,c,h,f,M,A,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s));}}else{const p=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let g=p,x=v;g<x;g+=3){const m=g,w=g+1,y=g+2;s=Oc(this,o,t,i,c,h,f,m,w,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s));}}}}function r2(r,t,e,i,s,n,o,a){let l;if(t.side===ThreeBackSide?l=i.intersectTriangle(o,n,s,!0,a):l=i.intersectTriangle(s,n,o,t.side===ThreeFrontSide,a),l===null)return null;Uc.copy(a),Uc.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Uc);return c<e.near||c>e.far?null:{distance:c,point:Uc.clone(),object:r};}function Oc(r,t,e,i,s,n,o,a,l,c){r.getVertexPosition(a,kc),r.getVertexPosition(l,Dc),r.getVertexPosition(c,Fc);const h=r2(r,t,e,i,kc,Dc,Fc,vm);if(h){const f=new ThreeVector3();ThreeTriangle.getBarycoord(vm,kc,Dc,Fc,f),s&&(h.uv=ThreeTriangle.getInterpolatedAttribute(s,a,l,c,f,new ThreeVector2())),n&&(h.uv1=ThreeTriangle.getInterpolatedAttribute(n,a,l,c,f,new ThreeVector2())),o&&(h.normal=ThreeTriangle.getInterpolatedAttribute(o,a,l,c,f,new ThreeVector3()),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new ThreeVector3(),materialIndex:0};ThreeTriangle.getNormal(kc,Dc,Fc,u.normal),h.face=u,h.barycoord=f;}return h;}const Za=new ThreeVector4();const xm=new ThreeVector4();const ym=new ThreeVector4();const a2=new ThreeVector4();const wm=new ThreeMatrix4();const Bc=new ThreeVector3();const of=new ThreeSphere();const _m=new ThreeMatrix4();const rf=new ThreeRay();class ThreeSkinnedMesh extends ThreeMesh{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ThreeAttachedBindMode,this.bindMatrix=new ThreeMatrix4(),this.bindMatrixInverse=new ThreeMatrix4(),this.boundingBox=null,this.boundingSphere=null;}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new ThreeBox3()),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,Bc),this.boundingBox.expandByPoint(Bc);}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ThreeSphere()),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,Bc),this.boundingSphere.expandByPoint(Bc);}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this;}raycast(t,e){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),of.copy(this.boundingSphere),of.applyMatrix4(s),t.ray.intersectsSphere(of)!==!1&&(_m.copy(s).invert(),rf.copy(t.ray).applyMatrix4(_m),!(this.boundingBox!==null&&rf.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,rf)));}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e;}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert();}pose(){this.skeleton.pose();}normalizeSkinWeights(){const t=new ThreeVector4(),e=this.geometry.attributes.skinWeight;for(let i=0,s=e.count;i<s;i++){t.fromBufferAttribute(e,i);const n=1/t.manhattanLength();n!==1/0?t.multiplyScalar(n):t.set(1,0,0,0),e.setXYZW(i,t.x,t.y,t.z,t.w);}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===ThreeAttachedBindMode?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===ThreeDetachedBindMode?this.bindMatrixInverse.copy(this.bindMatrix).invert():Threewarn("SkinnedMesh: Unrecognized bindMode: "+this.bindMode);}applyBoneTransform(t,e){const i=this.skeleton,s=this.geometry;xm.fromBufferAttribute(s.attributes.skinIndex,t),ym.fromBufferAttribute(s.attributes.skinWeight,t),e.isVector4?(Za.copy(e),e.set(0,0,0,0)):(Za.set(...e,1),e.set(0,0,0)),Za.applyMatrix4(this.bindMatrix);for(let n=0;n<4;n++){const o=ym.getComponent(n);if(o!==0){const a=xm.getComponent(n);wm.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),e.addScaledVector(a2.copy(Za).applyMatrix4(wm),o);}}return e.isVector4&&(e.w=Za.w),e.applyMatrix4(this.bindMatrixInverse);}}class ThreeBone extends ThreeObject3D{constructor(){super(),this.isBone=!0,this.type="Bone";}}class ThreeDataTexture extends ThreeTexture{constructor(t=null,e=1,i=1,s,n,o,a,l,c=ThreeNearestFilter,h=ThreeNearestFilter,f,u){super(null,o,a,l,c,h,s,n,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1;}}const bm=new ThreeMatrix4();const l2=new ThreeMatrix4();class ThreeSkeleton{constructor(t=[],e=[]){this.uuid=Rs(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init();}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){Threewarn("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new ThreeMatrix4());}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const i=new ThreeMatrix4();this.bones[t]&&i.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(i);}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&i.matrixWorld.copy(this.boneInverses[t]).invert();}for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale));}}update(){const t=this.bones,e=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let n=0,o=t.length;n<o;n++){const a=t[n]?t[n].matrixWorld:l2;bm.multiplyMatrices(a,e[n]),bm.toArray(i,n*16);}s!==null&&(s.needsUpdate=!0);}clone(){return new ThreeSkeleton(this.bones,this.boneInverses);}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const i=new ThreeDataTexture(e,t,t,ThreeRGBAFormat,ThreeFloatType);return i.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=i,this;}getBoneByName(t){for(let e=0,i=this.bones.length;e<i;e++){const s=this.bones[e];if(s.name===t)return s;}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null);}fromJSON(t,e){this.uuid=t.uuid;for(let i=0,s=t.bones.length;i<s;i++){const n=t.bones[i];let o=e[n];o===void 0&&(Threewarn("Skeleton: No bone found with UUID:",n),o=new ThreeBone()),this.bones.push(o),this.boneInverses.push(new ThreeMatrix4().fromArray(t.boneInverses[i]));}return this.init(),this;}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,i=this.boneInverses;for(let s=0,n=e.length;s<n;s++){const o=e[s];t.bones.push(o.uuid);const a=i[s];t.boneInverses.push(a.toArray());}return t;}}class ThreeInstancedBufferAttribute extends ThreeBufferAttribute{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s;}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this;}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t;}}const $r=new ThreeMatrix4();const Mm=new ThreeMatrix4();const Vc=[];const Sm=new ThreeBox3();const c2=new ThreeMatrix4();const ja=new ThreeMesh();const Ka=new ThreeSphere();class ThreeInstancedMesh extends ThreeMesh{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ThreeInstancedBufferAttribute(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,c2);}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ThreeBox3()),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,$r),Sm.copy(t.boundingBox).applyMatrix4($r),this.boundingBox.union(Sm);}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ThreeSphere()),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,$r),Ka.copy(t.boundingSphere).applyMatrix4($r),this.boundingSphere.union(Ka);}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this;}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3);}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16);}getMorphAt(t,e){const i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,n=i.length+1,o=t*n+1;for(let a=0;a<i.length;a++)i[a]=s[o+a];}raycast(t,e){const i=this.matrixWorld,s=this.count;if(ja.geometry=this.geometry,ja.material=this.material,ja.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ka.copy(this.boundingSphere),Ka.applyMatrix4(i),t.ray.intersectsSphere(Ka)!==!1))for(let n=0;n<s;n++){this.getMatrixAt(n,$r),Mm.multiplyMatrices(i,$r),ja.matrixWorld=Mm,ja.raycast(t,Vc);for(let o=0,a=Vc.length;o<a;o++){const l=Vc[o];l.instanceId=n,l.object=this,e.push(l);}Vc.length=0;}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ThreeInstancedBufferAttribute(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this;}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this;}setMorphAt(t,e){const i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new ThreeDataTexture(new Float32Array(s*this.count),s,this.count,ThreeRedFormat,ThreeFloatType));const n=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return n[l]=a,n.set(i,l+1),this;}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null);}}const Ho=new ThreeSphere();const h2=new ThreeVector2(.5,.5);const Gc=new ThreeVector3();class ThreeFrustum{constructor(t=new ThreePlane(),e=new ThreePlane(),i=new ThreePlane(),s=new ThreePlane(),n=new ThreePlane(),o=new ThreePlane()){this.planes=[t,e,i,s,n,o];}set(t,e,i,s,n,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(n),a[5].copy(o),this;}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this;}setFromProjectionMatrix(t,e=ThreeWebGLCoordinateSystem,i=!1){const s=this.planes,n=t.elements,o=n[0],a=n[1],l=n[2],c=n[3],h=n[4],f=n[5],u=n[6],d=n[7],p=n[8],v=n[9],g=n[10],x=n[11],m=n[12],w=n[13],y=n[14],_=n[15];if(s[0].setComponents(c-o,d-h,x-p,_-m).normalize(),s[1].setComponents(c+o,d+h,x+p,_+m).normalize(),s[2].setComponents(c+a,d+f,x+v,_+w).normalize(),s[3].setComponents(c-a,d-f,x-v,_-w).normalize(),i)s[4].setComponents(l,u,g,y).normalize(),s[5].setComponents(c-l,d-u,x-g,_-y).normalize();else if(s[4].setComponents(c-l,d-u,x-g,_-y).normalize(),e===ThreeWebGLCoordinateSystem)s[5].setComponents(c+l,d+u,x+g,_+y).normalize();else if(e===ThreeWebGPUCoordinateSystem)s[5].setComponents(l,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this;}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ho.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ho.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);}return this.intersectsSphere(Ho);}intersectsSprite(t){Ho.center.set(0,0,0);const e=h2.distanceTo(t.center);return Ho.radius=.7071067811865476+e,Ho.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ho);}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let n=0;n<6;n++)if(e[n].distanceToPoint(i)<s)return!1;return!0;}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Gc.x=s.normal.x>0?t.max.x:t.min.x,Gc.y=s.normal.y>0?t.max.y:t.min.y,Gc.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Gc)<0)return!1;}return!0;}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0;}clone(){return new this.constructor().copy(this);}}const Am=new ThreeMatrix4();class ThreeFrustumArray{constructor(){this.coordinateSystem=ThreeWebGLCoordinateSystem,this._frustums=[],this._count=0;}setFromArrayCamera(t){const e=t.cameras,i=this._frustums;for(let s=0;s<e.length;s++){const n=e[s];Am.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),i[s]===void 0&&(i[s]=new ThreeFrustum()),i[s].setFromProjectionMatrix(Am,n.coordinateSystem,n.reversedDepth);}return this._count=e.length,this;}intersectsObject(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsObject(t))return!0;return!1;}intersectsSprite(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSprite(t))return!0;return!1;}intersectsSphere(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSphere(t))return!0;return!1;}intersectsBox(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsBox(t))return!0;return!1;}containsPoint(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].containsPoint(t))return!0;return!1;}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,i=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new ThreeFrustum()),e[s].copy(i[s]);return this._count=t._count,this;}clone(){return new ThreeFrustumArray().copy(this);}}function af(r,t){return r-t;}function u2(r,t){return r.z-t.z;}function f2(r,t){return t.z-r.z;}class d2{constructor(){this.index=0,this.pool=[],this.list=[];}push(t,e,i,s){const n=this.pool,o=this.list;this.index>=n.length&&n.push({start:-1,count:-1,z:-1,index:-1});const a=n[this.index];o.push(a),this.index++,a.start=t,a.count=e,a.z=i,a.index=s;}reset(){this.list.length=0,this.index=0;}}const ps=new ThreeMatrix4();const p2=new ThreeColor(1,1,1);const m2=new ThreeFrustum();const g2=new ThreeFrustumArray();const Hc=new ThreeBox3();const Wo=new ThreeSphere();const Ja=new ThreeVector3();const Tm=new ThreeVector3();const v2=new ThreeVector3();const lf=new d2();const $i=new ThreeMesh();const Wc=[];function x2(r,t,e=0){const i=t.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==t.array.constructor){const s=r.count;for(let n=0;n<s;n++)for(let o=0;o<i;o++)t.setComponent(n+e,o,r.getComponent(n,o));}else t.array.set(r.array,e*i);t.needsUpdate=!0;}function qo(r,t){if(r.constructor!==t.constructor){const e=Math.min(r.length,t.length);for(let i=0;i<e;i++)t[i]=r[i];}else{const e=Math.min(r.length,t.length);t.set(new r.constructor(r.buffer,0,e));}}class ThreeBatchedMesh extends ThreeMesh{constructor(t,e,i=e*2,s){super(new ThreeBufferGeometry(),s),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=i,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture();}get maxInstanceCount(){return this._maxInstanceCount;}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length;}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart;}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart;}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4),i=new ThreeDataTexture(e,t,t,ThreeRGBAFormat,ThreeFloatType);this._matricesTexture=i;}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Uint32Array(t*t),i=new ThreeDataTexture(e,t,t,ThreeRedIntegerFormat,ThreeUnsignedIntType);this._indirectTexture=i;}_initColorsTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Float32Array(t*t*4).fill(1),i=new ThreeDataTexture(e,t,t,ThreeRGBAFormat,ThreeFloatType);i.colorSpace=ThreeColorManagement.workingColorSpace,this._colorsTexture=i;}_initializeGeometry(t){const e=this.geometry,i=this._maxVertexCount,s=this._maxIndexCount;if(this._geometryInitialized===!1){for(const n in t.attributes){const o=t.getAttribute(n),{array:a,itemSize:l,normalized:c}=o,h=new a.constructor(i*l),f=new ThreeBufferAttribute(h,l,c);e.setAttribute(n,f);}if(t.getIndex()!==null){const n=i>65535?new Uint32Array(s):new Uint16Array(s);e.setIndex(new ThreeBufferAttribute(n,1));}this._geometryInitialized=!0;}}_validateGeometry(t){const e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const i in e.attributes){if(!t.hasAttribute(i))throw new Error(`THREE.BatchedMesh: Added geometry missing "${i}". All geometries must have consistent attributes.`);const s=t.getAttribute(i),n=e.getAttribute(i);if(s.itemSize!==n.itemSize||s.normalized!==n.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.");}}validateInstanceId(t){const e=this._instanceInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${t}. Instance is either out of range or has been deleted.`);}validateGeometryId(t){const e=this._geometryInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${t}. Geometry is either out of range or has been deleted.`);}setCustomSort(t){return this.customSort=t,this;}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ThreeBox3());const t=this.boundingBox,e=this._instanceInfo;t.makeEmpty();for(let i=0,s=e.length;i<s;i++){if(e[i].active===!1)continue;const n=e[i].geometryIndex;this.getMatrixAt(i,ps),this.getBoundingBoxAt(n,Hc).applyMatrix4(ps),t.union(Hc);}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ThreeSphere());const t=this.boundingSphere,e=this._instanceInfo;t.makeEmpty();for(let i=0,s=e.length;i<s;i++){if(e[i].active===!1)continue;const n=e[i].geometryIndex;this.getMatrixAt(i,ps),this.getBoundingSphereAt(n,Wo).applyMatrix4(ps),t.union(Wo);}}addInstance(t){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const i={visible:!0,active:!0,geometryIndex:t};let s=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(af),s=this._availableInstanceIds.shift(),this._instanceInfo[s]=i):(s=this._instanceInfo.length,this._instanceInfo.push(i));const n=this._matricesTexture;ps.identity().toArray(n.image.data,s*16),n.needsUpdate=!0;const o=this._colorsTexture;return o&&(p2.toArray(o.image.data,s*4),o.needsUpdate=!0),this._visibilityChanged=!0,s;}addGeometry(t,e=-1,i=-1){this._initializeGeometry(t),this._validateGeometry(t);const s={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},n=this._geometryInfo;s.vertexStart=this._nextVertexStart,s.reservedVertexCount=e===-1?t.getAttribute("position").count:e;const o=t.getIndex();if(o!==null&&(s.indexStart=this._nextIndexStart,s.reservedIndexCount=i===-1?o.count:i),s.indexStart!==-1&&s.indexStart+s.reservedIndexCount>this._maxIndexCount||s.vertexStart+s.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(af),l=this._availableGeometryIds.shift(),n[l]=s):(l=this._geometryCount,this._geometryCount++,n.push(s)),this.setGeometryAt(l,t),this._nextIndexStart=s.indexStart+s.reservedIndexCount,this._nextVertexStart=s.vertexStart+s.reservedVertexCount,l;}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);const i=this.geometry,s=i.getIndex()!==null,n=i.getIndex(),o=e.getIndex(),a=this._geometryInfo[t];if(s&&o.count>a.reservedIndexCount||e.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const l=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=e.getAttribute("position").count;for(const h in i.attributes){const f=e.getAttribute(h),u=i.getAttribute(h);x2(f,u,l);const d=f.itemSize;for(let p=f.count,v=c;p<v;p++){const g=l+p;for(let x=0;x<d;x++)u.setComponent(g,x,0);}u.needsUpdate=!0,u.addUpdateRange(l*d,c*d);}if(s){const h=a.indexStart,f=a.reservedIndexCount;a.indexCount=e.getIndex().count;for(let u=0;u<o.count;u++)n.setX(h+u,l+o.getX(u));for(let u=o.count,d=f;u<d;u++)n.setX(h+u,l);n.needsUpdate=!0,n.addUpdateRange(h,a.reservedIndexCount);}return a.start=s?a.indexStart:a.vertexStart,a.count=s?a.indexCount:a.vertexCount,a.boundingBox=null,e.boundingBox!==null&&(a.boundingBox=e.boundingBox.clone()),a.boundingSphere=null,e.boundingSphere!==null&&(a.boundingSphere=e.boundingSphere.clone()),this._visibilityChanged=!0,t;}deleteGeometry(t){const e=this._geometryInfo;if(t>=e.length||e[t].active===!1)return this;const i=this._instanceInfo;for(let s=0,n=i.length;s<n;s++)i[s].active&&i[s].geometryIndex===t&&this.deleteInstance(s);return e[t].active=!1,this._availableGeometryIds.push(t),this._visibilityChanged=!0,this;}deleteInstance(t){return this.validateInstanceId(t),this._instanceInfo[t].active=!1,this._availableInstanceIds.push(t),this._visibilityChanged=!0,this;}optimize(){let t=0,e=0;const i=this._geometryInfo,s=i.map((o,a)=>a).sort((o,a)=>i[o].vertexStart-i[a].vertexStart),n=this.geometry;for(let o=0,a=i.length;o<a;o++){const l=s[o],c=i[l];if(c.active!==!1){if(n.index!==null){if(c.indexStart!==e){const{indexStart:h,vertexStart:f,reservedIndexCount:u}=c,d=n.index,p=d.array,v=t-f;for(let g=h;g<h+u;g++)p[g]=p[g]+v;d.array.copyWithin(e,h,h+u),d.addUpdateRange(e,u),d.needsUpdate=!0,c.indexStart=e;}e+=c.reservedIndexCount;}if(c.vertexStart!==t){const{vertexStart:h,reservedVertexCount:f}=c,u=n.attributes;for(const d in u){const p=u[d],{array:v,itemSize:g}=p;v.copyWithin(t*g,h*g,(h+f)*g),p.addUpdateRange(t*g,f*g),p.needsUpdate=!0;}c.vertexStart=t;}t+=c.reservedVertexCount,c.start=n.index?c.indexStart:c.vertexStart;}}return this._nextIndexStart=e,this._nextVertexStart=t,this._visibilityChanged=!0,this;}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;const i=this.geometry,s=this._geometryInfo[t];if(s.boundingBox===null){const n=new ThreeBox3(),o=i.index,a=i.attributes.position;for(let l=s.start,c=s.start+s.count;l<c;l++){let h=l;o&&(h=o.getX(h)),n.expandByPoint(Ja.fromBufferAttribute(a,h));}s.boundingBox=n;}return e.copy(s.boundingBox),e;}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;const i=this.geometry,s=this._geometryInfo[t];if(s.boundingSphere===null){const n=new ThreeSphere();this.getBoundingBoxAt(t,Hc),Hc.getCenter(n.center);const o=i.index,a=i.attributes.position;let l=0;for(let c=s.start,h=s.start+s.count;c<h;c++){let f=c;o&&(f=o.getX(f)),Ja.fromBufferAttribute(a,f),l=Math.max(l,n.center.distanceToSquared(Ja));}n.radius=Math.sqrt(l),s.boundingSphere=n;}return e.copy(s.boundingSphere),e;}setMatrixAt(t,e){this.validateInstanceId(t);const i=this._matricesTexture,s=this._matricesTexture.image.data;return e.toArray(s,t*16),i.needsUpdate=!0,this;}getMatrixAt(t,e){return this.validateInstanceId(t),e.fromArray(this._matricesTexture.image.data,t*16);}setColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null&&this._initColorsTexture(),e.toArray(this._colorsTexture.image.data,t*4),this._colorsTexture.needsUpdate=!0,this;}getColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null?e.isVector4?e.set(1,1,1,1):e.setRGB(1,1,1):e.fromArray(this._colorsTexture.image.data,t*4);}setVisibleAt(t,e){return this.validateInstanceId(t),this._instanceInfo[t].visible===e?this:(this._instanceInfo[t].visible=e,this._visibilityChanged=!0,this);}getVisibleAt(t){return this.validateInstanceId(t),this._instanceInfo[t].visible;}setGeometryIdAt(t,e){return this.validateInstanceId(t),this.validateGeometryId(e),this._instanceInfo[t].geometryIndex=e,this._visibilityChanged=!0,this;}getGeometryIdAt(t){return this.validateInstanceId(t),this._instanceInfo[t].geometryIndex;}getGeometryRangeAt(t,e={}){this.validateGeometryId(t);const i=this._geometryInfo[t];return e.vertexStart=i.vertexStart,e.vertexCount=i.vertexCount,e.reservedVertexCount=i.reservedVertexCount,e.indexStart=i.indexStart,e.indexCount=i.indexCount,e.reservedIndexCount=i.reservedIndexCount,e.start=i.start,e.count=i.count,e;}setInstanceCount(t){const e=this._availableInstanceIds,i=this._instanceInfo;for(e.sort(af);e[e.length-1]===i.length-1;)i.pop(),e.pop();if(t<i.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${t} are being used. Cannot shrink instance count.`);const s=new Int32Array(t),n=new Int32Array(t);qo(this._multiDrawCounts,s),qo(this._multiDrawStarts,n),this._multiDrawCounts=s,this._multiDrawStarts=n,this._maxInstanceCount=t;const o=this._indirectTexture,a=this._matricesTexture,l=this._colorsTexture;o.dispose(),this._initIndirectTexture(),qo(o.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),qo(a.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),qo(l.image.data,this._colorsTexture.image.data));}setGeometrySize(t,e){const i=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...i.map(a=>a.vertexStart+a.reservedVertexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...i.map(l=>l.indexStart+l.reservedIndexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${e}. Cannot shrink further.`);const n=this.geometry;n.dispose(),this._maxVertexCount=t,this._maxIndexCount=e,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new ThreeBufferGeometry(),this._initializeGeometry(n));const o=this.geometry;n.index&&qo(n.index.array,o.index.array);for(const a in n.attributes)qo(n.attributes[a].array,o.attributes[a].array);}raycast(t,e){const i=this._instanceInfo,s=this._geometryInfo,n=this.matrixWorld,o=this.geometry;$i.material=this.material,$i.geometry.index=o.index,$i.geometry.attributes=o.attributes,$i.geometry.boundingBox===null&&($i.geometry.boundingBox=new ThreeBox3()),$i.geometry.boundingSphere===null&&($i.geometry.boundingSphere=new ThreeSphere());for(let a=0,l=i.length;a<l;a++){if(!i[a].visible||!i[a].active)continue;const c=i[a].geometryIndex,h=s[c];$i.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(a,$i.matrixWorld).premultiply(n),this.getBoundingBoxAt(c,$i.geometry.boundingBox),this.getBoundingSphereAt(c,$i.geometry.boundingSphere),$i.raycast(t,Wc);for(let f=0,u=Wc.length;f<u;f++){const d=Wc[f];d.object=this,d.batchId=a,e.push(d);}Wc.length=0;}$i.material=null,$i.geometry.index=null,$i.geometry.attributes={},$i.geometry.setDrawRange(0,1/0);}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._geometryInfo=t._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox!==null?e.boundingBox.clone():null,boundingSphere:e.boundingSphere!==null?e.boundingSphere.clone():null})),this._instanceInfo=t._instanceInfo.map(e=>({...e})),this._availableInstanceIds=t._availableInstanceIds.slice(),this._availableGeometryIds=t._availableGeometryIds.slice(),this._nextIndexStart=t._nextIndexStart,this._nextVertexStart=t._nextVertexStart,this._geometryCount=t._geometryCount,this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._multiDrawBytesPerElement=t._multiDrawBytesPerElement,this._indirectTexture=t._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this;}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null);}onBeforeRender(t,e,i,s,n){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const o=s.getIndex();let a=o===null?1:o.array.BYTES_PER_ELEMENT,l=1;n.wireframe&&(l=2,a=s.attributes.position.count>65535?4:2);const c=this._instanceInfo,h=this._multiDrawStarts,f=this._multiDrawCounts,u=this._geometryInfo,d=this.perObjectFrustumCulled,p=this._indirectTexture,v=p.image.data,g=i.isArrayCamera?g2:m2;d&&(i.isArrayCamera?g.setFromArrayCamera(i):(ps.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse).multiply(this.matrixWorld),g.setFromProjectionMatrix(ps,i.coordinateSystem,i.reversedDepth)));let x=0;if(this.sortObjects){ps.copy(this.matrixWorld).invert(),Ja.setFromMatrixPosition(i.matrixWorld).applyMatrix4(ps),Tm.set(0,0,-1).transformDirection(i.matrixWorld).transformDirection(ps);for(let y=0,_=c.length;y<_;y++)if(c[y].visible&&c[y].active){const M=c[y].geometryIndex;this.getMatrixAt(y,ps),this.getBoundingSphereAt(M,Wo).applyMatrix4(ps);let A=!1;if(d&&(A=!g.intersectsSphere(Wo)),!A){const b=u[M],S=v2.subVectors(Wo.center,Ja).dot(Tm);lf.push(b.start,b.count,S,y);}}const m=lf.list,w=this.customSort;w===null?m.sort(n.transparent?f2:u2):w.call(this,m,i);for(let y=0,_=m.length;y<_;y++){const M=m[y];h[x]=M.start*a*l,f[x]=M.count*l,v[x]=M.index,x++;}lf.reset();}else for(let m=0,w=c.length;m<w;m++)if(c[m].visible&&c[m].active){const y=c[m].geometryIndex;let _=!1;if(d&&(this.getMatrixAt(m,ps),this.getBoundingSphereAt(y,Wo).applyMatrix4(ps),_=!g.intersectsSphere(Wo)),!_){const M=u[y];h[x]=M.start*a*l,f[x]=M.count*l,v[x]=m,x++;}}p.needsUpdate=!0,this._multiDrawCount=x,this._multiDrawBytesPerElement=a,this._visibilityChanged=!1;}onBeforeShadow(t,e,i,s,n,o){this.onBeforeRender(t,null,s,n,o);}}class ThreeLineBasicMaterial extends ThreeMaterial{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ThreeColor(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this;}}const L0=new ThreeVector3();const I0=new ThreeVector3();const Em=new ThreeMatrix4();const Qa=new ThreeRay();const qc=new ThreeSphere();const cf=new ThreeVector3();const Cm=new ThreeVector3();class ThreeLine extends ThreeObject3D{constructor(t=new ThreeBufferGeometry(),e=new ThreeLineBasicMaterial()){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets();}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this;}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,n=e.count;s<n;s++)L0.fromBufferAttribute(e,s-1),I0.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=L0.distanceTo(I0);t.setAttribute("lineDistance",new ThreeFloat32BufferAttribute(i,1));}else Threewarn("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this;}intersectsFrustum(t){return t.intersectsObject(this);}raycast(t,e){const i=this.geometry,s=this.matrixWorld,n=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qc.copy(i.boundingSphere),qc.applyMatrix4(s),qc.radius+=n,t.ray.intersectsSphere(qc)===!1)return;Em.copy(s).invert(),Qa.copy(t.ray).applyMatrix4(Em);const a=n/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let v=d,g=p-1;v<g;v+=c){const x=h.getX(v),m=h.getX(v+1),w=Xc(this,t,Qa,l,x,m,v);w&&e.push(w);}if(this.isLineLoop){const v=h.getX(p-1),g=h.getX(d),x=Xc(this,t,Qa,l,v,g,p-1);x&&e.push(x);}}else{const d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let v=d,g=p-1;v<g;v+=c){const x=Xc(this,t,Qa,l,v,v+1,v);x&&e.push(x);}if(this.isLineLoop){const v=Xc(this,t,Qa,l,p-1,d,p-1);v&&e.push(v);}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,o=s.length;n<o;n++){const a=s[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n;}}}}}function Xc(r,t,e,i,s,n,o){const a=r.geometry.attributes.position;if(L0.fromBufferAttribute(a,s),I0.fromBufferAttribute(a,n),e.distanceSqToSegment(L0,I0,cf,Cm)>i)return;cf.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(cf);if(!(c<t.near||c>t.far))return{distance:c,point:Cm.clone().applyMatrix4(r.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:r};}const Rm=new ThreeVector3();const zm=new ThreeVector3();class ThreeLineSegments extends ThreeLine{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments";}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,n=e.count;s<n;s+=2)Rm.fromBufferAttribute(e,s),zm.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Rm.distanceTo(zm);t.setAttribute("lineDistance",new ThreeFloat32BufferAttribute(i,1));}else Threewarn("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this;}}class ThreeLineLoop extends ThreeLine{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop";}}class ThreePointsMaterial extends ThreeMaterial{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ThreeColor(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this;}}const Pm=new ThreeMatrix4();const xd=new ThreeRay();const Yc=new ThreeSphere();const $c=new ThreeVector3();class ThreePoints extends ThreeObject3D{constructor(t=new ThreeBufferGeometry(),e=new ThreePointsMaterial()){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets();}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this;}intersectsFrustum(t){return t.intersectsObject(this);}raycast(t,e){const i=this.geometry,s=this.matrixWorld,n=t.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Yc.copy(i.boundingSphere),Yc.applyMatrix4(s),Yc.radius+=n,t.ray.intersectsSphere(Yc)===!1)return;Pm.copy(s).invert(),xd.copy(t.ray).applyMatrix4(Pm);const a=n/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,f=i.attributes.position;if(c!==null){const u=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let p=u,v=d;p<v;p++){const g=c.getX(p);$c.fromBufferAttribute(f,g),Lm($c,g,l,s,t,e,this);}}else{const u=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let p=u,v=d;p<v;p++)$c.fromBufferAttribute(f,p),Lm($c,p,l,s,t,e,this);}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,o=s.length;n<o;n++){const a=s[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n;}}}}}function Lm(r,t,e,i,s,n,o){const a=xd.distanceSqToPoint(r);if(a<e){const l=new ThreeVector3();xd.closestPointToPoint(r,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;n.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o});}}class ThreeVideoTexture extends ThreeTexture{constructor(t,e,i,s,n=ThreeLinearFilter,o=ThreeLinearFilter,a,l,c){super(t,e,i,s,n,o,a,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function f(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(f);}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(f));}clone(){return new this.constructor(this.image).copy(this);}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0);}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose();}}class ThreeVideoFrameTexture extends ThreeVideoTexture{constructor(t,e,i,s,n,o,a,l){super({},t,e,i,s,n,o,a,l),this.isVideoFrameTexture=!0;}update(){}clone(){return new this.constructor().copy(this);}setFrame(t){this.image=t,this.needsUpdate=!0;}}class ThreeFramebufferTexture extends ThreeTexture{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=ThreeNearestFilter,this.minFilter=ThreeNearestFilter,this.generateMipmaps=!1,this.needsUpdate=!0;}}class ThreeCompressedTexture extends ThreeTexture{constructor(t,e,i,s,n,o,a,l,c,h,f,u){super(null,o,a,l,c,h,s,n,f,u),this.isCompressedTexture=!0,this.image={width:e,height:i},this.mipmaps=t,this.flipY=!1,this.generateMipmaps=!1;}}class ThreeCompressedArrayTexture extends ThreeCompressedTexture{constructor(t,e,i,s,n,o){super(t,e,i,n,o),this.isCompressedArrayTexture=!0,this.image.depth=s,this.wrapR=ThreeClampToEdgeWrapping,this.layerUpdates=new Set();}copy(t){return super.copy(t),this.wrapR=t.wrapR,this;}addLayerUpdate(t){this.layerUpdates.add(t);}clearLayerUpdates(){this.layerUpdates.clear();}}class ThreeCompressedCubeTexture extends ThreeCompressedTexture{constructor(t,e,i){super(void 0,t[0].width,t[0].height,e,i,ThreeCubeReflectionMapping),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=t;}}class ThreeCubeTexture extends ThreeTexture{constructor(t=[],e=ThreeCubeReflectionMapping,i,s,n,o,a,l,c,h){super(t,e,i,s,n,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1;}get images(){return this.image;}set images(t){this.image=t;}}class ThreeCanvasTexture extends ThreeTexture{constructor(t,e,i,s,n,o,a,l,c){super(t,e,i,s,n,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0;}}class ThreeHTMLTexture extends ThreeTexture{constructor(t,e,i,s,n,o,a,l,c){super(t,e,i,s,n,o,a,l,c),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;const h=t?t.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0;},h.requestPaint());}dispose(){const t=this.image?this.image.parentNode:null;t!==null&&"onpaint"in t&&(t.onpaint=null),super.dispose();}}class ThreeDepthTexture extends ThreeTexture{constructor(t,e,i=ThreeUnsignedIntType,s,n,o,a=ThreeNearestFilter,l=ThreeNearestFilter,c,h=ThreeDepthFormat,f=1){if(h!==ThreeDepthFormat&&h!==ThreeDepthStencilFormat)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:f};super(u,s,n,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null;}copy(t){return super.copy(t),this.source=new ThreeTextureSource(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this;}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e;}}class ThreeCubeDepthTexture extends ThreeDepthTexture{constructor(t,e=ThreeUnsignedIntType,i=ThreeCubeReflectionMapping,s,n,o=ThreeNearestFilter,a=ThreeNearestFilter,l,c=ThreeDepthFormat){const h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,i,s,n,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0;}get images(){return this.image;}set images(t){this.image=t;}}class ThreeExternalTexture extends ThreeTexture{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0;}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this;}}class ThreeBoxGeometry extends ThreeBufferGeometry{constructor(t=1,e=1,i=1,s=1,n=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:n,depthSegments:o};const a=this;s=Math.floor(s),n=Math.floor(n),o=Math.floor(o);const l=[],c=[],h=[],f=[];let u=0,d=0;p("z","y","x",-1,-1,i,e,t,o,n,0),p("z","y","x",1,-1,i,e,-t,o,n,1),p("x","z","y",1,1,t,i,e,s,o,2),p("x","z","y",1,-1,t,i,-e,s,o,3),p("x","y","z",1,-1,t,e,i,s,n,4),p("x","y","z",-1,-1,t,e,-i,s,n,5),this.setIndex(l),this.setAttribute("position",new ThreeFloat32BufferAttribute(c,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(h,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(f,2));function p(v,g,x,m,w,y,_,M,A,b,S){const E=y/A,T=_/b,R=y/2,z=_/2,L=M/2,k=A+1,U=b+1;let F=0,G=0;const B=new ThreeVector3();for(let q=0;q<U;q++){const X=q*T-z;for(let vt=0;vt<k;vt++){const gt=vt*E-R;B[v]=gt*m,B[g]=X*w,B[x]=L,c.push(B.x,B.y,B.z),B[v]=0,B[g]=0,B[x]=M>0?1:-1,h.push(B.x,B.y,B.z),f.push(vt/A),f.push(1-q/b),F+=1;}}for(let q=0;q<b;q++)for(let X=0;X<A;X++){const vt=u+X+k*q,gt=u+X+k*(q+1),Qt=u+(X+1)+k*(q+1),te=u+(X+1)+k*q;l.push(vt,gt,te),l.push(gt,Qt,te),G+=6;}a.addGroup(d,G,S),d+=G,u+=F;}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeBoxGeometry(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments);}}class ThreeCapsuleGeometry extends ThreeBufferGeometry{constructor(t=1,e=1,i=4,s=8,n=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:n},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),n=Math.max(1,Math.floor(n));const o=[],a=[],l=[],c=[],h=e/2,f=Math.PI/2*t,u=e,d=2*f+u,p=i*2+n,v=s+1,g=new ThreeVector3(),x=new ThreeVector3();for(let m=0;m<=p;m++){let w=0,y=0,_=0,M=0;if(m<=i){const S=m/i,E=S*Math.PI/2;y=-h-t*Math.cos(E),_=t*Math.sin(E),M=-t*Math.cos(E),w=S*f;}else if(m<=i+n){const S=(m-i)/n;y=-h+S*e,_=t,M=0,w=f+S*u;}else{const S=(m-i-n)/i,E=S*Math.PI/2;y=h+t*Math.sin(E),_=t*Math.cos(E),M=t*Math.sin(E),w=f+u+S*f;}const A=Math.max(0,Math.min(1,w/d));let b=0;m===0?b=.5/s:m===p&&(b=-.5/s);for(let S=0;S<=s;S++){const E=S/s,T=E*Math.PI*2,R=Math.sin(T),z=Math.cos(T);x.x=-_*z,x.y=y,x.z=_*R,a.push(x.x,x.y,x.z),g.set(-_*z,M,_*R),g.normalize(),l.push(g.x,g.y,g.z),c.push(E+b,A);}if(m>0){const S=(m-1)*v;for(let E=0;E<s;E++){const T=S+E,R=S+E+1,z=m*v+E,L=m*v+E+1;o.push(T,R,z),o.push(R,L,z);}}}this.setIndex(o),this.setAttribute("position",new ThreeFloat32BufferAttribute(a,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(l,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(c,2));}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeCapsuleGeometry(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments);}}class ThreeCircleGeometry extends ThreeBufferGeometry{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const n=[],o=[],a=[],l=[],c=new ThreeVector3(),h=new ThreeVector2();o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){const d=i+f/e*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y);}for(let f=1;f<=e;f++)n.push(f,f+1,0);this.setIndex(n),this.setAttribute("position",new ThreeFloat32BufferAttribute(o,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(a,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(l,2));}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeCircleGeometry(t.radius,t.segments,t.thetaStart,t.thetaLength);}}class ThreeCylinderGeometry extends ThreeBufferGeometry{constructor(t=1,e=1,i=1,s=32,n=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:n,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),n=Math.floor(n);const h=[],f=[],u=[],d=[];let p=0;const v=[],g=i/2;let x=0;m(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ThreeFloat32BufferAttribute(f,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(u,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(d,2));function m(){const y=new ThreeVector3(),_=new ThreeVector3();let M=0;const A=(e-t)/i;for(let b=0;b<=n;b++){const S=[],E=b/n,T=E*(e-t)+t;for(let R=0;R<=s;R++){const z=R/s,L=z*l+a,k=Math.sin(L),U=Math.cos(L);_.x=T*k,_.y=-E*i+g,_.z=T*U,f.push(_.x,_.y,_.z),y.set(k,A,U).normalize(),u.push(y.x,y.y,y.z),d.push(z,1-E),S.push(p++);}v.push(S);}for(let b=0;b<s;b++)for(let S=0;S<n;S++){const E=v[S][b],T=v[S+1][b],R=v[S+1][b+1],z=v[S][b+1];(t>0||S!==0)&&(h.push(E,T,z),M+=3),(e>0||S!==n-1)&&(h.push(T,R,z),M+=3);}c.addGroup(x,M,0),x+=M;}function w(y){const _=p,M=new ThreeVector2(),A=new ThreeVector3();let b=0;const S=y===!0?t:e,E=y===!0?1:-1;for(let R=1;R<=s;R++)f.push(0,g*E,0),u.push(0,E,0),d.push(.5,.5),p++;const T=p;for(let R=0;R<=s;R++){const L=R/s*l+a,k=Math.cos(L),U=Math.sin(L);A.x=S*U,A.y=g*E,A.z=S*k,f.push(A.x,A.y,A.z),u.push(0,E,0),M.x=k*.5+.5,M.y=U*.5*E+.5,d.push(M.x,M.y),p++;}for(let R=0;R<s;R++){const z=_+R,L=T+R;y===!0?h.push(L,L+1,z):h.push(L+1,L,z),b+=3;}c.addGroup(x,b,y===!0?1:2),x+=b;}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeCylinderGeometry(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength);}}class ThreeConeGeometry extends ThreeCylinderGeometry{constructor(t=1,e=1,i=32,s=1,n=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,n,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:n,thetaStart:o,thetaLength:a};}static fromJSON(t){return new ThreeConeGeometry(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength);}}class ThreePolyhedronGeometry extends ThreeBufferGeometry{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const n=[],o=[];a(s),c(i),h(),this.setAttribute("position",new ThreeFloat32BufferAttribute(n,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(n.slice(),3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(m){const w=new ThreeVector3(),y=new ThreeVector3(),_=new ThreeVector3();for(let M=0;M<e.length;M+=3)d(e[M+0],w),d(e[M+1],y),d(e[M+2],_),l(w,y,_,m);}function l(m,w,y,_){const M=_+1,A=[];for(let b=0;b<=M;b++){A[b]=[];const S=m.clone().lerp(y,b/M),E=w.clone().lerp(y,b/M),T=M-b;for(let R=0;R<=T;R++)R===0&&b===M?A[b][R]=S:A[b][R]=S.clone().lerp(E,R/T);}for(let b=0;b<M;b++)for(let S=0;S<2*(M-b)-1;S++){const E=Math.floor(S/2);S%2===0?(u(A[b][E+1]),u(A[b+1][E]),u(A[b][E])):(u(A[b][E+1]),u(A[b+1][E+1]),u(A[b+1][E]));}}function c(m){const w=new ThreeVector3();for(let y=0;y<n.length;y+=3)w.x=n[y+0],w.y=n[y+1],w.z=n[y+2],w.normalize().multiplyScalar(m),n[y+0]=w.x,n[y+1]=w.y,n[y+2]=w.z;}function h(){const m=new ThreeVector3();for(let w=0;w<n.length;w+=3){m.x=n[w+0],m.y=n[w+1],m.z=n[w+2];const y=g(m)/2/Math.PI+.5,_=x(m)/Math.PI+.5;o.push(y,1-_);}p(),f();}function f(){for(let m=0;m<o.length;m+=6){const w=o[m+0],y=o[m+2],_=o[m+4],M=Math.max(w,y,_),A=Math.min(w,y,_);M>.9&&A<.1&&(w<.2&&(o[m+0]+=1),y<.2&&(o[m+2]+=1),_<.2&&(o[m+4]+=1));}}function u(m){n.push(m.x,m.y,m.z);}function d(m,w){const y=m*3;w.x=t[y+0],w.y=t[y+1],w.z=t[y+2];}function p(){const m=new ThreeVector3(),w=new ThreeVector3(),y=new ThreeVector3(),_=new ThreeVector3(),M=new ThreeVector2(),A=new ThreeVector2(),b=new ThreeVector2();for(let S=0,E=0;S<n.length;S+=9,E+=6){m.set(n[S+0],n[S+1],n[S+2]),w.set(n[S+3],n[S+4],n[S+5]),y.set(n[S+6],n[S+7],n[S+8]),M.set(o[E+0],o[E+1]),A.set(o[E+2],o[E+3]),b.set(o[E+4],o[E+5]),_.copy(m).add(w).add(y).divideScalar(3);const T=g(_);v(M,E+0,m,T),v(A,E+2,w,T),v(b,E+4,y,T);}}function v(m,w,y,_){_<0&&m.x===1&&(o[w]=m.x-1),y.x===0&&y.z===0&&(o[w]=_/2/Math.PI+.5);}function g(m){return Math.atan2(m.z,-m.x);}function x(m){return Math.atan2(-m.y,Math.sqrt(m.x*m.x+m.z*m.z));}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreePolyhedronGeometry(t.vertices,t.indices,t.radius,t.detail);}}class ThreeDodecahedronGeometry extends ThreePolyhedronGeometry{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=1/i,n=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(n,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e};}static fromJSON(t){return new ThreeDodecahedronGeometry(t.radius,t.detail);}}const Zc=new ThreeVector3();const jc=new ThreeVector3();const hf=new ThreeVector3();const Kc=new ThreeTriangle();class ThreeEdgesGeometry extends ThreeBufferGeometry{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),n=Math.cos(pr*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),u={},d=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:v,b:g,c:x}=Kc;if(v.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),x.fromBufferAttribute(a,c[2]),Kc.getNormal(hf),f[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let m=0;m<3;m++){const w=(m+1)%3,y=f[m],_=f[w],M=Kc[h[m]],A=Kc[h[w]],b=`${y}_${_}`,S=`${_}_${y}`;S in u&&u[S]?(hf.dot(u[S].normal)<=n&&(d.push(M.x,M.y,M.z),d.push(A.x,A.y,A.z)),u[S]=null):b in u||(u[b]={index0:c[m],index1:c[w],normal:hf.clone()});}}for(const p in u)if(u[p]){const{index0:v,index1:g}=u[p];Zc.fromBufferAttribute(a,v),jc.fromBufferAttribute(a,g),d.push(Zc.x,Zc.y,Zc.z),d.push(jc.x,jc.y,jc.z);}this.setAttribute("position",new ThreeFloat32BufferAttribute(d,3));}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}}class ThreeCurve{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null;}getPoint(){Threewarn("Curve: .getPoint() not implemented.");}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e);}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e;}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e;}getLength(){const t=this.getLengths();return t[t.length-1];}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),n=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),n+=i.distanceTo(s),e.push(n),s=i;return this.cacheArcLengths=e,e;}updateArcLengths(){this.needsUpdate=!0,this.getLengths();}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const n=i.length;let o;e?o=e:o=t*i[n-1];let a=0,l=n-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=i[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break;}if(s=l,i[s]===o)return s/(n-1);const h=i[s],u=i[s+1]-h,d=(o-h)/u;return(s+d)/(n-1);}getTangent(t,e){let s=t-1e-4,n=t+1e-4;s<0&&(s=0),n>1&&(n=1);const o=this.getPoint(s),a=this.getPoint(n),l=e||(o.isVector2?new ThreeVector2():new ThreeVector3());return l.copy(a).sub(o).normalize(),l;}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e);}computeFrenetFrames(t,e=!1){const i=new ThreeVector3(),s=[],n=[],o=[],a=new ThreeVector3(),l=new ThreeMatrix4();for(let d=0;d<=t;d++){const p=d/t;s[d]=this.getTangentAt(p,new ThreeVector3());}n[0]=new ThreeVector3(),o[0]=new ThreeVector3();let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),u<=c&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),n[0].crossVectors(s[0],a),o[0].crossVectors(s[0],n[0]);for(let d=1;d<=t;d++){if(n[d]=n[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(ge(s[d-1].dot(s[d]),-1,1));n[d].applyMatrix4(l.makeRotationAxis(a,p));}o[d].crossVectors(s[d],n[d]);}if(e===!0){let d=Math.acos(ge(n[0].dot(n[t]),-1,1));d/=t,s[0].dot(a.crossVectors(n[0],n[t]))>0&&(d=-d);for(let p=1;p<=t;p++)n[p].applyMatrix4(l.makeRotationAxis(s[p],d*p)),o[p].crossVectors(s[p],n[p]);}return{tangents:s,normals:n,binormals:o};}clone(){return new this.constructor().copy(this);}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this;}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t;}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this;}}class ThreeEllipseCurve extends ThreeCurve{constructor(t=0,e=0,i=1,s=1,n=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=n,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l;}getPoint(t,e=new ThreeVector2()){const i=e,s=Math.PI*2;let n=this.aEndAngle-this.aStartAngle;const o=Math.abs(n)<Number.EPSILON;for(;n<0;)n+=s;for(;n>s;)n-=s;n<Number.EPSILON&&(o?n=0:n=s),this.aClockwise===!0&&!o&&(n===s?n=-s:n=n-s);const a=this.aStartAngle+t*n;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY;}return i.set(l,c);}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this;}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t;}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this;}}class ThreeArcCurve extends ThreeEllipseCurve{constructor(t,e,i,s,n,o){super(t,e,i,i,s,n,o),this.isArcCurve=!0,this.type="ArcCurve";}}function hp(){let r=0,t=0,e=0,i=0;function s(n,o,a,l){r=n,t=a,e=-3*n+3*o-2*a-l,i=2*n-2*o+a+l;}return{initCatmullRom:function(n,o,a,l,c){s(o,a,c*(a-n),c*(l-o));},initNonuniformCatmullRom:function(n,o,a,l,c,h,f){let u=(o-n)/c-(a-n)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+f)+(l-a)/f;u*=h,d*=h,s(o,a,u,d);},calc:function(n){const o=n*n,a=o*n;return r+t*n+e*o+i*a;}};}const Im=new ThreeVector3();const km=new ThreeVector3();const uf=new hp();const ff=new hp();const df=new hp();class ThreeCatmullRomCurve3 extends ThreeCurve{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s;}getPoint(t,e=new ThreeVector3()){const i=e,s=this.points,n=s.length,o=(n-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/n)+1)*n:l===0&&a===n-1&&(a=n-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%n]:(km.subVectors(s[0],s[1]).add(s[0]),c=km);const f=s[a%n],u=s[(a+1)%n];if(this.closed||a+2<n?h=s[(a+2)%n]:(Im.subVectors(s[n-1],s[n-2]).add(s[n-1]),h=Im),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(u),d),g=Math.pow(u.distanceToSquared(h),d);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),uf.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,p,v,g),ff.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,p,v,g),df.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,p,v,g);}else this.curveType==="catmullrom"&&(uf.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),ff.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),df.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return i.set(uf.calc(l),ff.calc(l),df.calc(l)),i;}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone());}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this;}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray());}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t;}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new ThreeVector3().fromArray(s));}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this;}}function Dm(r,t,e,i,s){const n=(i-t)*.5,o=(s-e)*.5,a=r*r,l=r*a;return(2*e-2*i+n+o)*l+(-3*e+3*i-2*n-o)*a+n*r+e;}function S2(r,t){const e=1-r;return e*e*t;}function A2(r,t){return 2*(1-r)*r*t;}function T2(r,t){return r*r*t;}function Ll(r,t,e,i){return S2(r,t)+A2(r,e)+T2(r,i);}function E2(r,t){const e=1-r;return e*e*e*t;}function C2(r,t){const e=1-r;return 3*e*e*r*t;}function R2(r,t){return 3*(1-r)*r*r*t;}function z2(r,t){return r*r*r*t;}function Il(r,t,e,i,s){return E2(r,t)+C2(r,e)+R2(r,i)+z2(r,s);}class ThreeCubicBezierCurve extends ThreeCurve{constructor(t=new ThreeVector2(),e=new ThreeVector2(),i=new ThreeVector2(),s=new ThreeVector2()){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s;}getPoint(t,e=new ThreeVector2()){const i=e,s=this.v0,n=this.v1,o=this.v2,a=this.v3;return i.set(Il(t,s.x,n.x,o.x,a.x),Il(t,s.y,n.y,o.y,a.y)),i;}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this;}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t;}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this;}}class ThreeCubicBezierCurve3 extends ThreeCurve{constructor(t=new ThreeVector3(),e=new ThreeVector3(),i=new ThreeVector3(),s=new ThreeVector3()){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s;}getPoint(t,e=new ThreeVector3()){const i=e,s=this.v0,n=this.v1,o=this.v2,a=this.v3;return i.set(Il(t,s.x,n.x,o.x,a.x),Il(t,s.y,n.y,o.y,a.y),Il(t,s.z,n.z,o.z,a.z)),i;}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this;}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t;}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this;}}class ThreeLineCurve extends ThreeCurve{constructor(t=new ThreeVector2(),e=new ThreeVector2()){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e;}getPoint(t,e=new ThreeVector2()){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i;}getPointAt(t,e){return this.getPoint(t,e);}getTangent(t,e=new ThreeVector2()){return e.subVectors(this.v2,this.v1).normalize();}getTangentAt(t,e){return this.getTangent(t,e);}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this;}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t;}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this;}}class ThreeLineCurve3 extends ThreeCurve{constructor(t=new ThreeVector3(),e=new ThreeVector3()){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e;}getPoint(t,e=new ThreeVector3()){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i;}getPointAt(t,e){return this.getPoint(t,e);}getTangent(t,e=new ThreeVector3()){return e.subVectors(this.v2,this.v1).normalize();}getTangentAt(t,e){return this.getTangent(t,e);}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this;}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t;}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this;}}class ThreeQuadraticBezierCurve extends ThreeCurve{constructor(t=new ThreeVector2(),e=new ThreeVector2(),i=new ThreeVector2()){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i;}getPoint(t,e=new ThreeVector2()){const i=e,s=this.v0,n=this.v1,o=this.v2;return i.set(Ll(t,s.x,n.x,o.x),Ll(t,s.y,n.y,o.y)),i;}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this;}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t;}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this;}}class ThreeQuadraticBezierCurve3 extends ThreeCurve{constructor(t=new ThreeVector3(),e=new ThreeVector3(),i=new ThreeVector3()){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i;}getPoint(t,e=new ThreeVector3()){const i=e,s=this.v0,n=this.v1,o=this.v2;return i.set(Ll(t,s.x,n.x,o.x),Ll(t,s.y,n.y,o.y),Ll(t,s.z,n.z,o.z)),i;}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this;}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t;}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this;}}class ThreeSplineCurve extends ThreeCurve{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t;}getPoint(t,e=new ThreeVector2()){const i=e,s=this.points,n=(s.length-1)*t,o=Math.floor(n),a=n-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return i.set(Dm(a,l.x,c.x,h.x,f.x),Dm(a,l.y,c.y,h.y,f.y)),i;}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone());}return this;}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray());}return t;}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new ThreeVector2().fromArray(s));}return this;}}var k0=Object.freeze({__proto__:null,ArcCurve:ThreeArcCurve,CatmullRomCurve3:ThreeCatmullRomCurve3,CubicBezierCurve:ThreeCubicBezierCurve,CubicBezierCurve3:ThreeCubicBezierCurve3,EllipseCurve:ThreeEllipseCurve,LineCurve:ThreeLineCurve,LineCurve3:ThreeLineCurve3,QuadraticBezierCurve:ThreeQuadraticBezierCurve,QuadraticBezierCurve3:ThreeQuadraticBezierCurve3,SplineCurve:ThreeSplineCurve});class ThreeCurvePath extends ThreeCurve{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1;}add(t){this.curves.push(t);}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new k0[i](e,t));}return this;}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let n=0;for(;n<s.length;){if(s[n]>=i){const o=s[n]-i,a=this.curves[n],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e);}n++;}return null;}getLength(){const t=this.getCurveLengths();return t[t.length-1];}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths();}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t;}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e;}getPoints(t=12){const e=[];let i;for(let s=0,n=this.curves;s<n.length;s++){const o=n[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h);}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e;}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone());}return this.autoClose=t.autoClose,this;}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON());}return t;}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new k0[s.type]().fromJSON(s));}return this;}}class ThreePath extends ThreeCurvePath{constructor(t){super(),this.type="Path",this.currentPoint=new ThreeVector2(),t&&this.setFromPoints(t);}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this;}moveTo(t,e){return this.currentPoint.set(t,e),this;}lineTo(t,e){const i=new ThreeLineCurve(this.currentPoint.clone(),new ThreeVector2(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this;}quadraticCurveTo(t,e,i,s){const n=new ThreeQuadraticBezierCurve(this.currentPoint.clone(),new ThreeVector2(t,e),new ThreeVector2(i,s));return this.curves.push(n),this.currentPoint.set(i,s),this;}bezierCurveTo(t,e,i,s,n,o){const a=new ThreeCubicBezierCurve(this.currentPoint.clone(),new ThreeVector2(t,e),new ThreeVector2(i,s),new ThreeVector2(n,o));return this.curves.push(a),this.currentPoint.set(n,o),this;}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new ThreeSplineCurve(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this;}arc(t,e,i,s,n,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,i,s,n,o),this;}absarc(t,e,i,s,n,o){return this.absellipse(t,e,i,i,s,n,o),this;}ellipse(t,e,i,s,n,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,n,o,a,l),this;}absellipse(t,e,i,s,n,o,a,l){const c=new ThreeEllipseCurve(t,e,i,s,n,o,a,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y);}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this;}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this;}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t;}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this;}}class ThreeShape extends ThreePath{constructor(t){super(t),this.uuid=Rs(),this.type="Shape",this.holes=[];}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e;}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)};}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone());}return this;}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON());}return t;}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new ThreePath().fromJSON(s));}return this;}}function P2(r,t,e=2){const i=t&&t.length,s=i?t[0]*e:r.length;let n=Bx(r,0,s,e,!0);const o=[];if(!n||n.next===n.prev)return o;let a,l,c;if(i&&(n=F2(r,t,n,e)),r.length>80*e){a=r[0],l=r[1];let h=a,f=l;for(let u=e;u<s;u+=e){const d=r[u],p=r[u+1];d<a&&(a=d),p<l&&(l=p),d>h&&(h=d),p>f&&(f=p);}c=Math.max(h-a,f-l),c=c!==0?32767/c:0;}return Zl(n,o,e,a,l,c,0),o;}function Bx(r,t,e,i,s){let n;if(s===Y2(r,t,e,i)>0)for(let o=t;o<e;o+=i)n=Fm(o/i|0,r[o],r[o+1],n);else for(let o=e-i;o>=t;o-=i)n=Fm(o/i|0,r[o],r[o+1],n);return n&&Ea(n,n.next)&&(Kl(n),n=n.next),n;}function _r(r,t){if(!r)return r;t||(t=r);let e=r,i;do if(i=!1,!e.steiner&&(Ea(e,e.next)||ri(e.prev,e,e.next)===0)){if(Kl(e),e=t=e.prev,e===e.next)break;i=!0;}else e=e.next;while(i||e!==t);return t;}function Zl(r,t,e,i,s,n,o){if(!r)return;!o&&n&&V2(r,i,s,n);let a=r;for(;r.prev!==r.next;){const l=r.prev,c=r.next;if(n?I2(r,i,s,n):L2(r)){t.push(l.i,r.i,c.i),Kl(r),r=c.next,a=c.next;continue;}if(r=c,r===a){o?o===1?(r=k2(_r(r),t),Zl(r,t,e,i,s,n,2)):o===2&&D2(r,t,e,i,s,n):Zl(_r(r),t,e,i,s,n,1);break;}}}function L2(r){const t=r.prev,e=r,i=r.next;if(ri(t,e,i)>=0)return!1;const s=t.x,n=e.x,o=i.x,a=t.y,l=e.y,c=i.y,h=Math.min(s,n,o),f=Math.min(a,l,c),u=Math.max(s,n,o),d=Math.max(a,l,c);let p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=f&&p.y<=d&&vl(s,a,n,l,o,c,p.x,p.y)&&ri(p.prev,p,p.next)>=0)return!1;p=p.next;}return!0;}function I2(r,t,e,i){const s=r.prev,n=r,o=r.next;if(ri(s,n,o)>=0)return!1;const a=s.x,l=n.x,c=o.x,h=s.y,f=n.y,u=o.y,d=Math.min(a,l,c),p=Math.min(h,f,u),v=Math.max(a,l,c),g=Math.max(h,f,u),x=yd(d,p,t,e,i),m=yd(v,g,t,e,i);let w=r.prevZ,y=r.nextZ;for(;w&&w.z>=x&&y&&y.z<=m;){if(w.x>=d&&w.x<=v&&w.y>=p&&w.y<=g&&w!==s&&w!==o&&vl(a,h,l,f,c,u,w.x,w.y)&&ri(w.prev,w,w.next)>=0||(w=w.prevZ,y.x>=d&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&vl(a,h,l,f,c,u,y.x,y.y)&&ri(y.prev,y,y.next)>=0))return!1;y=y.nextZ;}for(;w&&w.z>=x;){if(w.x>=d&&w.x<=v&&w.y>=p&&w.y<=g&&w!==s&&w!==o&&vl(a,h,l,f,c,u,w.x,w.y)&&ri(w.prev,w,w.next)>=0)return!1;w=w.prevZ;}for(;y&&y.z<=m;){if(y.x>=d&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&vl(a,h,l,f,c,u,y.x,y.y)&&ri(y.prev,y,y.next)>=0)return!1;y=y.nextZ;}return!0;}function k2(r,t){let e=r;do{const i=e.prev,s=e.next.next;!Ea(i,s)&&Gx(i,e,e.next,s)&&jl(i,s)&&jl(s,i)&&(t.push(i.i,e.i,s.i),Kl(e),Kl(e.next),e=r=s),e=e.next;}while(e!==r);return _r(e);}function D2(r,t,e,i,s,n){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&W2(o,a)){let l=Hx(o,a);o=_r(o,o.next),l=_r(l,l.next),Zl(o,t,e,i,s,n,0),Zl(l,t,e,i,s,n,0);return;}a=a.next;}o=o.next;}while(o!==r);}function F2(r,t,e,i){const s=[];for(let n=0,o=t.length;n<o;n++){const a=t[n]*i,l=n<o-1?t[n+1]*i:r.length,c=Bx(r,a,l,i,!1);c===c.next&&(c.steiner=!0),s.push(H2(c));}s.sort(N2);for(let n=0;n<s.length;n++)e=U2(s[n],e);return e;}function N2(r,t){let e=r.x-t.x;if(e===0&&(e=r.y-t.y,e===0)){const i=(r.next.y-r.y)/(r.next.x-r.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s;}return e;}function U2(r,t){const e=O2(r,t);if(!e)return t;const i=Hx(e,r);return _r(i,i.next),_r(e,e.next);}function O2(r,t){let e=t;const i=r.x,s=r.y;let n=-1/0,o;if(Ea(r,e))return e;do{if(Ea(r,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=i&&f>n&&(n=f,o=e.x<e.next.x?e:e.next,f===i))return o;}e=e.next;}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let h=1/0;e=o;do{if(i>=e.x&&e.x>=l&&i!==e.x&&Vx(s<c?i:n,s,l,c,s<c?n:i,s,e.x,e.y)){const f=Math.abs(s-e.y)/(i-e.x);jl(e,r)&&(f<h||f===h&&(e.x>o.x||e.x===o.x&&B2(o,e)))&&(o=e,h=f);}e=e.next;}while(e!==a);return o;}function B2(r,t){return ri(r.prev,r,t.prev)<0&&ri(t.next,r,r.next)<0;}function V2(r,t,e,i){let s=r;do s.z===0&&(s.z=yd(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==r);s.prevZ.nextZ=null,s.prevZ=null,G2(s);}function G2(r){let t,e=1;do{let i=r,s;r=null;let n=null;for(t=0;i;){t++;let o=i,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(s=i,i=i.nextZ,a--):(s=o,o=o.nextZ,l--),n?n.nextZ=s:r=s,s.prevZ=n,n=s;i=o;}n.nextZ=null,e*=2;}while(t>1);return r;}function yd(r,t,e,i,s){return r=(r-e)*s|0,t=(t-i)*s|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1;}function H2(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e;}function Vx(r,t,e,i,s,n,o,a){return(s-o)*(t-a)>=(r-o)*(n-a)&&(r-o)*(i-a)>=(e-o)*(t-a)&&(e-o)*(n-a)>=(s-o)*(i-a);}function vl(r,t,e,i,s,n,o,a){return!(r===o&&t===a)&&Vx(r,t,e,i,s,n,o,a);}function W2(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!q2(r,t)&&(jl(r,t)&&jl(t,r)&&X2(r,t)&&(ri(r.prev,r,t.prev)||ri(r,t.prev,t))||Ea(r,t)&&ri(r.prev,r,r.next)>0&&ri(t.prev,t,t.next)>0);}function ri(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y);}function Ea(r,t){return r.x===t.x&&r.y===t.y;}function Gx(r,t,e,i){const s=Qc(ri(r,t,e)),n=Qc(ri(r,t,i)),o=Qc(ri(e,i,r)),a=Qc(ri(e,i,t));return!!(s!==n&&o!==a||s===0&&Jc(r,e,t)||n===0&&Jc(r,i,t)||o===0&&Jc(e,r,i)||a===0&&Jc(e,t,i));}function Jc(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y);}function Qc(r){return r>0?1:r<0?-1:0;}function q2(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&Gx(e,e.next,r,t))return!0;e=e.next;}while(e!==r);return!1;}function jl(r,t){return ri(r.prev,r,r.next)<0?ri(r,t,r.next)>=0&&ri(r,r.prev,t)>=0:ri(r,t,r.prev)<0||ri(r,r.next,t)<0;}function X2(r,t){let e=r,i=!1;const s=(r.x+t.x)/2,n=(r.y+t.y)/2;do e.y>n!=e.next.y>n&&e.next.y!==e.y&&s<(e.next.x-e.x)*(n-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==r);return i;}function Hx(r,t){const e=wd(r.i,r.x,r.y),i=wd(t.i,t.x,t.y),s=r.next,n=t.prev;return r.next=t,t.prev=r,e.next=s,s.prev=e,i.next=e,e.prev=i,n.next=i,i.prev=n,i;}function Fm(r,t,e,i){const s=wd(r,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s;}function Kl(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ);}function wd(r,t,e){return{i:r,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1};}function Y2(r,t,e,i){let s=0;for(let n=t,o=e-i;n<e;n+=i)s+=(r[o]-r[n])*(r[n+1]+r[o+1]),o=n;return s;}class $2{static triangulate(t,e,i=2){return P2(t,e,i);}}class ThreeShapeUtils{static area(t){const e=t.length;let i=0;for(let s=e-1,n=0;n<e;s=n++)i+=t[s].x*t[n].y-t[n].x*t[s].y;return i*.5;}static isClockWise(t){return ThreeShapeUtils.area(t)<0;}static triangulateShape(t,e){const i=[],s=[],n=[];Nm(t),Um(i,t);let o=t.length;e.forEach(Nm);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Um(i,e[l]);const a=$2.triangulate(i,s);for(let l=0;l<a.length;l+=3)n.push(a.slice(l,l+3));return n;}}function Nm(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop();}function Um(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y);}class ThreeExtrudeGeometry extends ThreeBufferGeometry{constructor(t=new ThreeShape([new ThreeVector2(.5,.5),new ThreeVector2(-.5,.5),new ThreeVector2(-.5,-.5),new ThreeVector2(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],n=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c);}this.setAttribute("position",new ThreeFloat32BufferAttribute(s,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(n,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const x=e.extrudePath,m=e.UVGenerator!==void 0?e.UVGenerator:Z2;let w,y=!1,_,M,A,b;if(x){w=x.getSpacedPoints(h),y=!0,u=!1;const et=x.isCatmullRomCurve3?x.closed:!1;_=x.computeFrenetFrames(h,et),M=new ThreeVector3(),A=new ThreeVector3(),b=new ThreeVector3();}u||(g=0,d=0,p=0,v=0);const S=a.extractPoints(c);let E=S.shape;const T=S.holes;if(!ThreeShapeUtils.isClockWise(E)){E=E.reverse();for(let et=0,ut=T.length;et<ut;et++){const dt=T[et];ThreeShapeUtils.isClockWise(dt)&&(T[et]=dt.reverse());}}function z(et){const dt=10000000000000001e-36;let ft=et[0];for(let wt=1;wt<=et.length;wt++){const Wt=wt%et.length,Ht=et[Wt],qt=Ht.x-ft.x,ce=Ht.y-ft.y,O=qt*qt+ce*ce,Ae=Math.max(Math.abs(Ht.x),Math.abs(Ht.y),Math.abs(ft.x),Math.abs(ft.y)),de=dt*Ae*Ae;if(O<=de){et.splice(Wt,1),wt--;continue;}ft=Ht;}}z(E),T.forEach(z);const L=T.length,k=E;for(let et=0;et<L;et++){const ut=T[et];E=E.concat(ut);}function U(et,ut,dt){return ut||Threeerror("ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(ut,dt);}const F=E.length;function G(et,ut,dt){let ft,wt,Wt;const Ht=et.x-ut.x,qt=et.y-ut.y,ce=dt.x-et.x,O=dt.y-et.y,Ae=Ht*Ht+qt*qt,de=Ht*O-qt*ce;if(Math.abs(de)>Number.EPSILON){const D=Math.sqrt(Ae),P=Math.sqrt(ce*ce+O*O),W=ut.x-qt/D,Z=ut.y+Ht/D,st=dt.x-O/P,_t=dt.y+ce/P,bt=((st-W)*O-(_t-Z)*ce)/(Ht*O-qt*ce);ft=W+Ht*bt-et.x,wt=Z+qt*bt-et.y;const ot=ft*ft+wt*wt;if(ot<=2)return new ThreeVector2(ft,wt);Wt=Math.sqrt(ot/2);}else{let D=!1;Ht>Number.EPSILON?ce>Number.EPSILON&&(D=!0):Ht<-Number.EPSILON?ce<-Number.EPSILON&&(D=!0):Math.sign(qt)===Math.sign(O)&&(D=!0),D?(ft=-qt,wt=Ht,Wt=Math.sqrt(Ae)):(ft=Ht,wt=qt,Wt=Math.sqrt(Ae/2));}return new ThreeVector2(ft/Wt,wt/Wt);}const B=[];for(let et=0,ut=k.length,dt=ut-1,ft=et+1;et<ut;et++,dt++,ft++)dt===ut&&(dt=0),ft===ut&&(ft=0),B[et]=G(k[et],k[dt],k[ft]);const q=[];let X,vt=B.concat();for(let et=0,ut=L;et<ut;et++){const dt=T[et];X=[];for(let ft=0,wt=dt.length,Wt=wt-1,Ht=ft+1;ft<wt;ft++,Wt++,Ht++)Wt===wt&&(Wt=0),Ht===wt&&(Ht=0),X[ft]=G(dt[ft],dt[Wt],dt[Ht]);q.push(X),vt=vt.concat(X);}let gt;if(g===0)gt=ThreeShapeUtils.triangulateShape(k,T);else{const et=[],ut=[];for(let dt=0;dt<g;dt++){const ft=dt/g,wt=d*Math.cos(ft*Math.PI/2),Wt=p*Math.sin(ft*Math.PI/2)+v;for(let Ht=0,qt=k.length;Ht<qt;Ht++){const ce=U(k[Ht],B[Ht],Wt);mt(ce.x,ce.y,-wt),ft===0&&et.push(ce);}for(let Ht=0,qt=L;Ht<qt;Ht++){const ce=T[Ht];X=q[Ht];const O=[];for(let Ae=0,de=ce.length;Ae<de;Ae++){const D=U(ce[Ae],X[Ae],Wt);mt(D.x,D.y,-wt),ft===0&&O.push(D);}ft===0&&ut.push(O);}}gt=ThreeShapeUtils.triangulateShape(et,ut);}const Qt=gt.length,te=p+v;for(let et=0;et<F;et++){const ut=u?U(E[et],vt[et],te):E[et];y?(A.copy(_.normals[0]).multiplyScalar(ut.x),M.copy(_.binormals[0]).multiplyScalar(ut.y),b.copy(w[0]).add(A).add(M),mt(b.x,b.y,b.z)):mt(ut.x,ut.y,0);}for(let et=1;et<=h;et++)for(let ut=0;ut<F;ut++){const dt=u?U(E[ut],vt[ut],te):E[ut];y?(A.copy(_.normals[et]).multiplyScalar(dt.x),M.copy(_.binormals[et]).multiplyScalar(dt.y),b.copy(w[et]).add(A).add(M),mt(b.x,b.y,b.z)):mt(dt.x,dt.y,f/h*et);}for(let et=g-1;et>=0;et--){const ut=et/g,dt=d*Math.cos(ut*Math.PI/2),ft=p*Math.sin(ut*Math.PI/2)+v;for(let wt=0,Wt=k.length;wt<Wt;wt++){const Ht=U(k[wt],B[wt],ft);mt(Ht.x,Ht.y,f+dt);}for(let wt=0,Wt=T.length;wt<Wt;wt++){const Ht=T[wt];X=q[wt];for(let qt=0,ce=Ht.length;qt<ce;qt++){const O=U(Ht[qt],X[qt],ft);y?mt(O.x,O.y+w[h-1].y,w[h-1].x+dt):mt(O.x,O.y,f+dt);}}}Zt(),J();function Zt(){const et=s.length/3;if(u){let ut=0,dt=F*ut;for(let ft=0;ft<Qt;ft++){const wt=gt[ft];Y(wt[2]+dt,wt[1]+dt,wt[0]+dt);}ut=h+g*2,dt=F*ut;for(let ft=0;ft<Qt;ft++){const wt=gt[ft];Y(wt[0]+dt,wt[1]+dt,wt[2]+dt);}}else{for(let ut=0;ut<Qt;ut++){const dt=gt[ut];Y(dt[2],dt[1],dt[0]);}for(let ut=0;ut<Qt;ut++){const dt=gt[ut];Y(dt[0]+F*h,dt[1]+F*h,dt[2]+F*h);}}i.addGroup(et,s.length/3-et,0);}function J(){const et=s.length/3;let ut=0;nt(k,ut),ut+=k.length;for(let dt=0,ft=T.length;dt<ft;dt++){const wt=T[dt];nt(wt,ut),ut+=wt.length;}i.addGroup(et,s.length/3-et,1);}function nt(et,ut){let dt=et.length;for(;--dt>=0;){const ft=dt;let wt=dt-1;wt<0&&(wt=et.length-1);for(let Wt=0,Ht=h+g*2;Wt<Ht;Wt++){const qt=F*Wt,ce=F*(Wt+1),O=ut+ft+qt,Ae=ut+wt+qt,de=ut+wt+ce,D=ut+ft+ce;xt(O,Ae,de,D);}}}function mt(et,ut,dt){l.push(et),l.push(ut),l.push(dt);}function Y(et,ut,dt){yt(et),yt(ut),yt(dt);const ft=s.length/3,wt=m.generateTopUV(i,s,ft-3,ft-2,ft-1);fe(wt[0]),fe(wt[1]),fe(wt[2]);}function xt(et,ut,dt,ft){yt(et),yt(ut),yt(ft),yt(ut),yt(dt),yt(ft);const wt=s.length/3,Wt=m.generateSideWallUV(i,s,wt-6,wt-3,wt-2,wt-1);fe(Wt[0]),fe(Wt[1]),fe(Wt[3]),fe(Wt[1]),fe(Wt[2]),fe(Wt[3]);}function yt(et){s.push(l[et*3+0]),s.push(l[et*3+1]),s.push(l[et*3+2]);}function fe(et){n.push(et.x),n.push(et.y);}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return j2(e,i,t);}static fromJSON(t,e){const i=[];for(let n=0,o=t.shapes.length;n<o;n++){const a=e[t.shapes[n]];i.push(a);}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new k0[s.type]().fromJSON(s)),new ThreeExtrudeGeometry(i,t.options);}}const Z2={generateTopUV:function(r,t,e,i,s){const n=t[e*3],o=t[e*3+1],a=t[i*3],l=t[i*3+1],c=t[s*3],h=t[s*3+1];return[new ThreeVector2(n,o),new ThreeVector2(a,l),new ThreeVector2(c,h)];},generateSideWallUV:function(r,t,e,i,s,n){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],f=t[i*3+2],u=t[s*3],d=t[s*3+1],p=t[s*3+2],v=t[n*3],g=t[n*3+1],x=t[n*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ThreeVector2(o,1-l),new ThreeVector2(c,1-f),new ThreeVector2(u,1-p),new ThreeVector2(v,1-x)]:[new ThreeVector2(a,1-l),new ThreeVector2(h,1-f),new ThreeVector2(d,1-p),new ThreeVector2(g,1-x)];}};function j2(r,t,e){if(e.shapes=[],Array.isArray(r))for(let i=0,s=r.length;i<s;i++){const n=r[i];e.shapes.push(n.uuid);}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e;}class ThreeIcosahedronGeometry extends ThreePolyhedronGeometry{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,n,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e};}static fromJSON(t){return new ThreeIcosahedronGeometry(t.radius,t.detail);}}class ThreeLatheGeometry extends ThreeBufferGeometry{constructor(t=[new ThreeVector2(0,-.5),new ThreeVector2(.5,0),new ThreeVector2(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=ge(s,0,Math.PI*2);const n=[],o=[],a=[],l=[],c=[],h=1/e,f=new ThreeVector3(),u=new ThreeVector2(),d=new ThreeVector3(),p=new ThreeVector3(),v=new ThreeVector3();let g=0,x=0;for(let m=0;m<=t.length-1;m++)switch(m){case 0:g=t[m+1].x-t[m].x,x=t[m+1].y-t[m].y,d.x=x*1,d.y=-g,d.z=x*0,v.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[m+1].x-t[m].x,x=t[m+1].y-t[m].y,d.x=x*1,d.y=-g,d.z=x*0,p.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),l.push(d.x,d.y,d.z),v.copy(p);}for(let m=0;m<=e;m++){const w=i+m*h*s,y=Math.sin(w),_=Math.cos(w);for(let M=0;M<=t.length-1;M++){f.x=t[M].x*y,f.y=t[M].y,f.z=t[M].x*_,o.push(f.x,f.y,f.z),u.x=m/e,u.y=M/(t.length-1),a.push(u.x,u.y);const A=l[3*M+0]*y,b=l[3*M+1],S=l[3*M+0]*_;c.push(A,b,S);}}for(let m=0;m<e;m++)for(let w=0;w<t.length-1;w++){const y=w+m*t.length,_=y,M=y+t.length,A=y+t.length+1,b=y+1;n.push(_,M,b),n.push(A,b,M);}this.setIndex(n),this.setAttribute("position",new ThreeFloat32BufferAttribute(o,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(a,2)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(c,3));}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeLatheGeometry(t.points,t.segments,t.phiStart,t.phiLength);}}class ThreeOctahedronGeometry extends ThreePolyhedronGeometry{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e};}static fromJSON(t){return new ThreeOctahedronGeometry(t.radius,t.detail);}}class ThreePlaneGeometry extends ThreeBufferGeometry{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const n=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,f=t/a,u=e/l,d=[],p=[],v=[],g=[];for(let x=0;x<h;x++){const m=x*u-o;for(let w=0;w<c;w++){const y=w*f-n;p.push(y,-m,0),v.push(0,0,1),g.push(w/a),g.push(1-x/l);}}for(let x=0;x<l;x++)for(let m=0;m<a;m++){const w=m+c*x,y=m+c*(x+1),_=m+1+c*(x+1),M=m+1+c*x;d.push(w,y,M),d.push(y,_,M);}this.setIndex(d),this.setAttribute("position",new ThreeFloat32BufferAttribute(p,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(v,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(g,2));}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreePlaneGeometry(t.width,t.height,t.widthSegments,t.heightSegments);}}class ThreeRingGeometry extends ThreeBufferGeometry{constructor(t=.5,e=1,i=32,s=1,n=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:n,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const a=[],l=[],c=[],h=[];let f=t;const u=(e-t)/s,d=new ThreeVector3(),p=new ThreeVector2();for(let v=0;v<=s;v++){for(let g=0;g<=i;g++){const x=n+g/i*o;d.x=f*Math.cos(x),d.y=f*Math.sin(x),l.push(d.x,d.y,d.z),c.push(0,0,1),p.x=(d.x/e+1)/2,p.y=(d.y/e+1)/2,h.push(p.x,p.y);}f+=u;}for(let v=0;v<s;v++){const g=v*(i+1);for(let x=0;x<i;x++){const m=x+g,w=m,y=m+i+1,_=m+i+2,M=m+1;a.push(w,y,M),a.push(y,_,M);}}this.setIndex(a),this.setAttribute("position",new ThreeFloat32BufferAttribute(l,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(c,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(h,2));}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeRingGeometry(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength);}}class ThreeShapeGeometry extends ThreeBufferGeometry{constructor(t=new ThreeShape([new ThreeVector2(0,.5),new ThreeVector2(-.5,-.5),new ThreeVector2(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],n=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(i),this.setAttribute("position",new ThreeFloat32BufferAttribute(s,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(n,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(o,2));function c(h){const f=s.length/3,u=h.extractPoints(e);let d=u.shape;const p=u.holes;ThreeShapeUtils.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,x=p.length;g<x;g++){const m=p[g];ThreeShapeUtils.isClockWise(m)===!0&&(p[g]=m.reverse());}const v=ThreeShapeUtils.triangulateShape(d,p);for(let g=0,x=p.length;g<x;g++){const m=p[g];d=d.concat(m);}for(let g=0,x=d.length;g<x;g++){const m=d[g];s.push(m.x,m.y,0),n.push(0,0,1),o.push(m.x,m.y);}for(let g=0,x=v.length;g<x;g++){const m=v[g],w=m[0]+f,y=m[1]+f,_=m[2]+f;i.push(w,y,_),l+=3;}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return K2(e,t);}static fromJSON(t,e){const i=[];for(let s=0,n=t.shapes.length;s<n;s++){const o=e[t.shapes[s]];i.push(o);}return new ThreeShapeGeometry(i,t.curveSegments);}}function K2(r,t){if(t.shapes=[],Array.isArray(r))for(let e=0,i=r.length;e<i;e++){const s=r[e];t.shapes.push(s.uuid);}else t.shapes.push(r.uuid);return t;}class ThreeSphereGeometry extends ThreeBufferGeometry{constructor(t=1,e=32,i=16,s=0,n=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:n,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const h=[],f=new ThreeVector3(),u=new ThreeVector3(),d=[],p=[],v=[],g=[];for(let x=0;x<=i;x++){const m=[],w=x/i,y=o+w*a,_=t*Math.cos(y),M=Math.sqrt(t*t-_*_);let A=0;x===0&&o===0?A=.5/e:x===i&&l===Math.PI&&(A=-.5/e);for(let b=0;b<=e;b++){const S=b/e,E=s+S*n;f.x=-M*Math.cos(E),f.y=_,f.z=M*Math.sin(E),p.push(f.x,f.y,f.z),u.copy(f).normalize(),v.push(u.x,u.y,u.z),g.push(S+A,1-w),m.push(c++);}h.push(m);}for(let x=0;x<i;x++)for(let m=0;m<e;m++){const w=h[x][m+1],y=h[x][m],_=h[x+1][m],M=h[x+1][m+1];(x!==0||o>0)&&d.push(w,y,M),(x!==i-1||l<Math.PI)&&d.push(y,_,M);}this.setIndex(d),this.setAttribute("position",new ThreeFloat32BufferAttribute(p,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(v,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(g,2));}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeSphereGeometry(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength);}}class ThreeTetrahedronGeometry extends ThreePolyhedronGeometry{constructor(t=1,e=0){const i=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(i,s,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e};}static fromJSON(t){return new ThreeTetrahedronGeometry(t.radius,t.detail);}}class ThreeTorusGeometry extends ThreeBufferGeometry{constructor(t=1,e=.4,i=12,s=48,n=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:n,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);const l=[],c=[],h=[],f=[],u=new ThreeVector3(),d=new ThreeVector3(),p=new ThreeVector3();for(let v=0;v<=i;v++){const g=o+v/i*a;for(let x=0;x<=s;x++){const m=x/s*n;d.x=(t+e*Math.cos(g))*Math.cos(m),d.y=(t+e*Math.cos(g))*Math.sin(m),d.z=e*Math.sin(g),c.push(d.x,d.y,d.z),u.x=t*Math.cos(m),u.y=t*Math.sin(m),p.subVectors(d,u).normalize(),h.push(p.x,p.y,p.z),f.push(x/s),f.push(v/i);}}for(let v=1;v<=i;v++)for(let g=1;g<=s;g++){const x=(s+1)*v+g-1,m=(s+1)*(v-1)+g-1,w=(s+1)*(v-1)+g,y=(s+1)*v+g;l.push(x,m,y),l.push(m,w,y);}this.setIndex(l),this.setAttribute("position",new ThreeFloat32BufferAttribute(c,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(h,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(f,2));}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeTorusGeometry(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength);}}class ThreeTorusKnotGeometry extends ThreeBufferGeometry{constructor(t=1,e=.4,i=64,s=8,n=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:i,radialSegments:s,p:n,q:o},i=Math.floor(i),s=Math.floor(s);const a=[],l=[],c=[],h=[],f=new ThreeVector3(),u=new ThreeVector3(),d=new ThreeVector3(),p=new ThreeVector3(),v=new ThreeVector3(),g=new ThreeVector3(),x=new ThreeVector3();for(let w=0;w<=i;++w){const y=w/i*n*Math.PI*2;m(y,n,o,t,d),m(y+.01,n,o,t,p),g.subVectors(p,d),x.addVectors(p,d),v.crossVectors(g,x),x.crossVectors(v,g),v.normalize(),x.normalize();for(let _=0;_<=s;++_){const M=_/s*Math.PI*2,A=-e*Math.cos(M),b=e*Math.sin(M);f.x=d.x+(A*x.x+b*v.x),f.y=d.y+(A*x.y+b*v.y),f.z=d.z+(A*x.z+b*v.z),l.push(f.x,f.y,f.z),u.subVectors(f,d).normalize(),c.push(u.x,u.y,u.z),h.push(w/i),h.push(_/s);}}for(let w=1;w<=i;w++)for(let y=1;y<=s;y++){const _=(s+1)*(w-1)+(y-1),M=(s+1)*w+(y-1),A=(s+1)*w+y,b=(s+1)*(w-1)+y;a.push(_,M,b),a.push(M,A,b);}this.setIndex(a),this.setAttribute("position",new ThreeFloat32BufferAttribute(l,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(c,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(h,2));function m(w,y,_,M,A){const b=Math.cos(w),S=Math.sin(w),E=_/y*w,T=Math.cos(E);A.x=M*(2+T)*.5*b,A.y=M*(2+T)*S*.5,A.z=M*Math.sin(E)*.5;}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}static fromJSON(t){return new ThreeTorusKnotGeometry(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q);}}class ThreeTubeGeometry extends ThreeBufferGeometry{constructor(t=new ThreeQuadraticBezierCurve3(new ThreeVector3(-1,-1,0),new ThreeVector3(-1,1,0),new ThreeVector3(1,1,0)),e=64,i=1,s=8,n=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:n};const o=t.computeFrenetFrames(e,n);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new ThreeVector3(),l=new ThreeVector3(),c=new ThreeVector2();let h=new ThreeVector3();const f=[],u=[],d=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new ThreeFloat32BufferAttribute(f,3)),this.setAttribute("normal",new ThreeFloat32BufferAttribute(u,3)),this.setAttribute("uv",new ThreeFloat32BufferAttribute(d,2));function v(){for(let w=0;w<e;w++)g(w);g(n===!1?e:0),m(),x();}function g(w){h=t.getPointAt(w/e,h);const y=o.normals[w],_=o.binormals[w];for(let M=0;M<=s;M++){const A=M/s*Math.PI*2,b=Math.sin(A),S=-Math.cos(A);l.x=S*y.x+b*_.x,l.y=S*y.y+b*_.y,l.z=S*y.z+b*_.z,l.normalize(),u.push(l.x,l.y,l.z),a.x=h.x+i*l.x,a.y=h.y+i*l.y,a.z=h.z+i*l.z,f.push(a.x,a.y,a.z);}}function x(){for(let w=1;w<=e;w++)for(let y=1;y<=s;y++){const _=(s+1)*(w-1)+(y-1),M=(s+1)*w+(y-1),A=(s+1)*w+y,b=(s+1)*(w-1)+y;p.push(_,M,b),p.push(M,A,b);}}function m(){for(let w=0;w<=e;w++)for(let y=0;y<=s;y++)c.x=w/e,c.y=y/s,d.push(c.x,c.y);}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t;}static fromJSON(t){return new ThreeTubeGeometry(new k0[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed);}}class ThreeWireframeGeometry extends ThreeBufferGeometry{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],i=new Set(),s=new ThreeVector3(),n=new ThreeVector3();if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const f=l[c],u=f.start,d=f.count;for(let p=u,v=u+d;p<v;p+=3)for(let g=0;g<3;g++){const x=a.getX(p+g),m=a.getX(p+(g+1)%3);s.fromBufferAttribute(o,x),n.fromBufferAttribute(o,m),Om(s,n,i)===!0&&(e.push(s.x,s.y,s.z),e.push(n.x,n.y,n.z));}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,f=3*a+(c+1)%3;s.fromBufferAttribute(o,h),n.fromBufferAttribute(o,f),Om(s,n,i)===!0&&(e.push(s.x,s.y,s.z),e.push(n.x,n.y,n.z));}}this.setAttribute("position",new ThreeFloat32BufferAttribute(e,3));}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this;}}function Om(r,t,e){const i=`${r.x},${r.y},${r.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${r.x},${r.y},${r.z}`;return e.has(i)===!0||e.has(s)===!0?!1:(e.add(i),e.add(s),!0);}var Bm=Object.freeze({__proto__:null,BoxGeometry:ThreeBoxGeometry,CapsuleGeometry:ThreeCapsuleGeometry,CircleGeometry:ThreeCircleGeometry,ConeGeometry:ThreeConeGeometry,CylinderGeometry:ThreeCylinderGeometry,DodecahedronGeometry:ThreeDodecahedronGeometry,EdgesGeometry:ThreeEdgesGeometry,ExtrudeGeometry:ThreeExtrudeGeometry,IcosahedronGeometry:ThreeIcosahedronGeometry,LatheGeometry:ThreeLatheGeometry,OctahedronGeometry:ThreeOctahedronGeometry,PlaneGeometry:ThreePlaneGeometry,PolyhedronGeometry:ThreePolyhedronGeometry,RingGeometry:ThreeRingGeometry,ShapeGeometry:ThreeShapeGeometry,SphereGeometry:ThreeSphereGeometry,TetrahedronGeometry:ThreeTetrahedronGeometry,TorusGeometry:ThreeTorusGeometry,TorusKnotGeometry:ThreeTorusKnotGeometry,TubeGeometry:ThreeTubeGeometry,WireframeGeometry:ThreeWireframeGeometry});class ThreeShadowMaterial extends ThreeMaterial{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ThreeColor(0),this.transparent=!0,this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this;}}function Ca(r){const t={};for(const e in r){t[e]={};for(const i in r[e]){const s=r[e][i];if(Vm(s))s.isRenderTargetTexture?(Threewarn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s)){if(Vm(s[0])){const n=[];for(let o=0,a=s.length;o<a;o++)n[o]=s[o].clone();t[e][i]=n;}else t[e][i]=s.slice();}else t[e][i]=s;}}return t;}function ns(r){const t={};for(let e=0;e<r.length;e++){const i=Ca(r[e]);for(const s in i)t[s]=i[s];}return t;}function Vm(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion);}function J2(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t;}function Xx(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ThreeColorManagement.workingColorSpace;}const ThreeUniformsUtils={clone:Ca,merge:ns};var Q2=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;var tb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ThreeShaderMaterial extends ThreeMaterial{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Q2,this.fragmentShader=tb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t);}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ca(t.uniforms),this.uniformsGroups=J2(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this;}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o};}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e;}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new ThreeColor().setHex(s.value);break;case"v2":this.uniforms[i].value=new ThreeVector2().fromArray(s.value);break;case"v3":this.uniforms[i].value=new ThreeVector3().fromArray(s.value);break;case"v4":this.uniforms[i].value=new ThreeVector4().fromArray(s.value);break;case"m3":this.uniforms[i].value=new ThreeMatrix3().fromArray(s.value);break;case"m4":this.uniforms[i].value=new ThreeMatrix4().fromArray(s.value);break;default:this.uniforms[i].value=s.value;}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this;}}class ThreeRawShaderMaterial extends ThreeShaderMaterial{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial";}}class ThreeMeshStandardMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ThreeColor(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ThreeColor(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ThreeTangentSpaceNormalMap,this.normalScale=new ThreeVector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ThreeEuler(),this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this;}}class ThreeMeshPhysicalMaterial extends ThreeMeshStandardMaterial{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ThreeVector2(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ge(2.5*(this.ior-1)/(this.ior+1),0,1);},set:function(e){this.ior=(1+.4*e)/(1-.4*e);}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ThreeColor(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ThreeColor(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ThreeColor(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t);}get anisotropy(){return this._anisotropy;}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t;}get clearcoat(){return this._clearcoat;}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t;}get iridescence(){return this._iridescence;}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t;}get dispersion(){return this._dispersion;}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t;}get retroreflectivity(){return this._retroreflectivity;}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t;}get sheen(){return this._sheen;}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t;}get transmission(){return this._transmission;}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t;}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this;}}class ThreeMeshPhongMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ThreeColor(16777215),this.specular=new ThreeColor(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ThreeColor(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ThreeTangentSpaceNormalMap,this.normalScale=new ThreeVector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ThreeEuler(),this.combine=ThreeMultiplyOperation,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this;}}class ThreeMeshToonMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ThreeColor(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ThreeColor(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ThreeTangentSpaceNormalMap,this.normalScale=new ThreeVector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this;}}class ThreeMeshNormalMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ThreeTangentSpaceNormalMap,this.normalScale=new ThreeVector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t);}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this;}}class ThreeMeshLambertMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ThreeColor(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ThreeColor(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ThreeTangentSpaceNormalMap,this.normalScale=new ThreeVector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ThreeEuler(),this.combine=ThreeMultiplyOperation,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this;}}class ThreeMeshDepthMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ThreeBasicDepthPacking,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t);}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this;}}class ThreeMeshDistanceMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t);}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this;}}class ThreeMeshMatcapMaterial extends ThreeMaterial{constructor(t){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new ThreeColor(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ThreeTangentSpaceNormalMap,this.normalScale=new ThreeVector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(t);}copy(t){return super.copy(t),this.defines={MATCAP:""},this.color.copy(t.color),this.matcap=t.matcap,this.map=t.map,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this.fog=t.fog,this;}}class ThreeLineDashedMaterial extends ThreeLineBasicMaterial{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t);}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this;}}function an(r,t){return!r||r.constructor===t?r:typeof t.BYTES_PER_ELEMENT=="number"?new t(r):Array.prototype.slice.call(r);}function kl(r){return r!==void 0&&r.inTangents!==void 0&&r.outTangents!==void 0;}function Qx(r){function t(s,n){return r[s]-r[n];}const e=r.length,i=new Array(e);for(let s=0;s!==e;++s)i[s]=s;return i.sort(t),i;}function _d(r,t,e){const i=r.length,s=new r.constructor(i);for(let n=0,o=0;o!==i;++n){const a=e[n]*t;for(let l=0;l!==t;++l)s[o++]=r[a+l];}return s;}function ty(r,t,e,i){let s=1,n=r[0];for(;n!==void 0&&n[i]===void 0;)n=r[s++];if(n===void 0)return;let o=n[i];if(o!==void 0)if(Array.isArray(o))do o=n[i],o!==void 0&&(t.push(n.time),e.push(...o)),n=r[s++];while(n!==void 0);else if(o.toArray!==void 0)do o=n[i],o!==void 0&&(t.push(n.time),o.toArray(e,e.length)),n=r[s++];while(n!==void 0);else do o=n[i],o!==void 0&&(t.push(n.time),e.push(o)),n=r[s++];while(n!==void 0);}function eb(r,t,e,i,s=30){const n=r.clone();n.name=t;const o=[];for(let l=0;l<n.tracks.length;++l){const c=n.tracks[l],h=c.getValueSize(),f=[],u=[];for(let d=0;d<c.times.length;++d){const p=c.times[d]*s;if(!(p<e||p>=i)){f.push(c.times[d]);for(let v=0;v<h;++v)u.push(c.values[d*h+v]);}}f.length!==0&&(c.times=an(f,c.times.constructor),c.values=an(u,c.values.constructor),o.push(c));}n.tracks=o;let a=1/0;for(let l=0;l<n.tracks.length;++l)a>n.tracks[l].times[0]&&(a=n.tracks[l].times[0]);for(let l=0;l<n.tracks.length;++l)n.tracks[l].shift(-1*a);return n.resetDuration(),n;}function ib(r,t=0,e=r,i=30){i<=0&&(i=30);const s=e.tracks.length,n=t/i;for(let o=0;o<s;++o){const a=e.tracks[o],l=a.ValueTypeName;if(l==="bool"||l==="string")continue;const c=r.tracks.find(function(x){return x.name===a.name&&x.ValueTypeName===l;});if(c===void 0)continue;let h=0;const f=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=f/3);let u=0;const d=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=d/3);const p=a.times.length-1;let v;if(n<=a.times[0]){const x=h,m=f-h;v=a.values.slice(x,m);}else if(n>=a.times[p]){const x=p*f+h,m=x+f-h;v=a.values.slice(x,m);}else{const x=a.createInterpolant(),m=h,w=f-h;x.evaluate(n),v=x.resultBuffer.slice(m,w);}l==="quaternion"&&new ThreeQuaternion().fromArray(v).normalize().conjugate().toArray(v);const g=c.times.length;for(let x=0;x<g;++x){const m=x*d+u;if(l==="quaternion")ThreeQuaternion.multiplyQuaternionsFlat(c.values,m,v,0,c.values,m);else{const w=d-u*2;for(let y=0;y<w;++y)c.values[m+y]-=v[y];}}}return r.blendMode=ThreeAdditiveAnimationBlendMode,r;}class ThreeAnimationUtils{static convertArray(t,e){return an(t,e);}static isTypedArray(t){return xx(t);}static hasTangents(t){return kl(t);}static getKeyframeOrder(t){return Qx(t);}static sortedArray(t,e,i){return _d(t,e,i);}static flattenJSON(t,e,i,s){ty(t,e,i,s);}static subclip(t,e,i,s,n=30){return eb(t,e,i,s,n);}static makeClipAdditive(t,e=0,i=t,s=30){return ib(t,e,i,s);}}class ThreeInterpolant{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={};}evaluate(t){const e=this.parameterPositions;let i=this._cachedIndex,s=e[i],n=e[i-1];t:{e:{let o;i:{s:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<n)break s;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1);}if(i===a)break;if(n=s,s=e[++i],t<s)break e;}o=e.length;break i;}if(!(t>=n)){const a=e[1];t<a&&(i=2,n=a);for(let l=i-2;;){if(n===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=n,n=e[--i-1],t>=n)break e;}o=i,i=0;break i;}break t;}for(;i<o;){const a=i+o>>>1;t<e[a]?o=a:i=a+1;}if(s=e[i],n=e[i-1],n===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1);}this._cachedIndex=i,this.intervalChanged_(i,n,s);}return this.interpolate_(i,n,t,s);}getSettings_(){return this.settings||this.DefaultSettings_;}copySampleValue_(t){const e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,n=t*s;for(let o=0;o!==s;++o)e[o]=i[n+o];return e;}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.");}intervalChanged_(){}}class ThreeCubicInterpolant extends ThreeInterpolant{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ThreeZeroCurvatureEnding,endingEnd:ThreeZeroCurvatureEnding};}intervalChanged_(t,e,i){const s=this.parameterPositions;let n=t-2,o=t+1,a=s[n],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ThreeZeroSlopeEnding:n=t,a=2*e-i;break;case ThreeWrapAroundEnding:n=s.length-2,a=e+s[n]-s[n+1];break;default:n=t,a=i;}if(l===void 0)switch(this.getSettings_().endingEnd){case ThreeZeroSlopeEnding:o=t,l=2*i-e;break;case ThreeWrapAroundEnding:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e;}const c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=n*h,this._offsetNext=o*h;}interpolate_(t,e,i,s){const n=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(i-e)/(s-e),v=p*p,g=v*p,x=-u*g+2*u*v-u*p,m=(1+u)*g+(-1.5-2*u)*v+(-.5+u)*p+1,w=(-1-d)*g+(1.5+d)*v+.5*p,y=d*g-d*v;for(let _=0;_!==a;++_)n[_]=x*o[h+_]+m*o[c+_]+w*o[l+_]+y*o[f+_];return n;}}class ThreeLinearInterpolant extends ThreeInterpolant{constructor(t,e,i,s){super(t,e,i,s);}interpolate_(t,e,i,s){const n=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(i-e)/(s-e),f=1-h;for(let u=0;u!==a;++u)n[u]=o[c+u]*f+o[l+u]*h;return n;}}class ThreeDiscreteInterpolant extends ThreeInterpolant{constructor(t,e,i,s){super(t,e,i,s);}interpolate_(t){return this.copySampleValue_(t-1);}}class ThreeBezierInterpolant extends ThreeInterpolant{interpolate_(t,e,i,s){const n=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,f=this.outTangents;if(!h||!f){const p=(i-e)/(s-e),v=1-p;for(let g=0;g!==a;++g)n[g]=o[c+g]*v+o[l+g]*p;return n;}const u=a*2,d=t-1;for(let p=0;p!==a;++p){const v=o[c+p],g=o[l+p],x=d*u+p*2,m=f[x],w=f[x+1],y=t*u+p*2,_=h[y],M=h[y+1],A=ob(i,e,m,_,s);n[p]=ny(A,v,w,M,g);}return n;}}function ny(r,t,e,i,s){const n=1-r;return n*n*n*t+3*n*n*r*e+3*n*r*r*i+r*r*r*s;}function nb(r,t,e,i,s){const n=1-r;return 3*n*n*(e-t)+6*n*r*(i-e)+3*r*r*(s-i);}function ob(r,t,e,i,s){let n=(r-t)/(s-t);for(let o=0;o<8;o++){const a=ny(n,t,e,i,s)-r;if(Math.abs(a)<1e-10)break;const l=nb(n,t,e,i,s);if(Math.abs(l)<1e-10)break;n=Math.max(0,Math.min(1,n-a/l));}return n;}class ThreeKeyframeTrack{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=an(e,this.TimeBufferType),this.values=an(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation);}static toJSON(t){const e=t.constructor;let i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:an(t.times,Array),values:an(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),kl(t.settings)&&(i.settings={inTangents:an(t.settings.inTangents,Array),outTangents:an(t.settings.outTangents,Array)});}return i.type=t.ValueTypeName,i;}InterpolantFactoryMethodDiscrete(t){return new ThreeDiscreteInterpolant(this.times,this.values,this.getValueSize(),t);}InterpolantFactoryMethodLinear(t){return new ThreeLinearInterpolant(this.times,this.values,this.getValueSize(),t);}InterpolantFactoryMethodSmooth(t){return new ThreeCubicInterpolant(this.times,this.values,this.getValueSize(),t);}InterpolantFactoryMethodBezier(t){const e=new ThreeBezierInterpolant(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e;}setInterpolation(t){let e;switch(t){case ThreeInterpolateDiscrete:e=this.InterpolantFactoryMethodDiscrete;break;case ThreeInterpolateLinear:e=this.InterpolantFactoryMethodLinear;break;case ThreeInterpolateSmooth:e=this.InterpolantFactoryMethodSmooth;break;case ThreeInterpolateBezier:e=this.InterpolantFactoryMethodBezier;break;}if(e===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Threewarn("KeyframeTrack:",i),this;}return this.createInterpolant=e,this;}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ThreeInterpolateDiscrete;case this.InterpolantFactoryMethodLinear:return ThreeInterpolateLinear;case this.InterpolantFactoryMethodSmooth:return ThreeInterpolateSmooth;case this.InterpolantFactoryMethodBezier:return ThreeInterpolateBezier;}}getValueSize(){return this.values.length/this.times.length;}shift(t){if(t!==0){const e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t;}return this;}scale(t){if(t!==1){const e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;kl(this.settings)&&(Gm(this.settings.inTangents,t),Gm(this.settings.outTangents,t));}return this;}trim(t,e){const i=this.times,s=i.length;let n=0,o=s-1;for(;n!==s&&i[n]<t;)++n;for(;o!==-1&&i[o]>e;)--o;if(++o,n!==0||o!==s){n>=o&&(o=Math.max(o,1),n=o-1);const a=this.getValueSize();this.times=i.slice(n,o),this.values=this.values.slice(n*a,o*a);}return this;}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(Threeerror("KeyframeTrack: Invalid value size in track.",this),t=!1);const i=this.times,s=this.values,n=i.length;n===0&&(Threeerror("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==n;a++){const l=i[a];if(typeof l=="number"&&isNaN(l)){Threeerror("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break;}if(o!==null&&o>l){Threeerror("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break;}o=l;}if(s!==void 0&&xx(s))for(let a=0,l=s.length;a!==l;++a){const c=s[a];if(isNaN(c)){Threeerror("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break;}}return t;}optimize(){const t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ThreeInterpolateSmooth,n=t.length-1;let o=1;for(let a=1;a<n;++a){let l=!1;const c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{const f=a*i,u=f-i,d=f+i;for(let p=0;p!==i;++p){const v=e[f+p];if(v!==e[u+p]||v!==e[d+p]){l=!0;break;}}}if(l){if(a!==o){t[o]=t[a];const f=a*i,u=o*i;for(let d=0;d!==i;++d)e[u+d]=e[f+d];}++o;}}if(n>0){t[o]=t[n];for(let a=n*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o;}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this;}clone(){const t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,kl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s;}}function Gm(r,t){for(let e=0,i=r.length;e!==i;e+=2)r[e]*=t;}ThreeKeyframeTrack.prototype.ValueTypeName="";ThreeKeyframeTrack.prototype.TimeBufferType=Float32Array;ThreeKeyframeTrack.prototype.ValueBufferType=Float32Array;ThreeKeyframeTrack.prototype.DefaultInterpolation=ThreeInterpolateLinear;class ThreeBooleanKeyframeTrack extends ThreeKeyframeTrack{constructor(t,e,i){super(t,e,i);}}ThreeBooleanKeyframeTrack.prototype.ValueTypeName="bool";ThreeBooleanKeyframeTrack.prototype.ValueBufferType=Array;ThreeBooleanKeyframeTrack.prototype.DefaultInterpolation=ThreeInterpolateDiscrete;ThreeBooleanKeyframeTrack.prototype.InterpolantFactoryMethodLinear=void 0;ThreeBooleanKeyframeTrack.prototype.InterpolantFactoryMethodSmooth=void 0;class ThreeColorKeyframeTrack extends ThreeKeyframeTrack{constructor(t,e,i,s){super(t,e,i,s);}}ThreeColorKeyframeTrack.prototype.ValueTypeName="color";class ThreeNumberKeyframeTrack extends ThreeKeyframeTrack{constructor(t,e,i,s){super(t,e,i,s);}}ThreeNumberKeyframeTrack.prototype.ValueTypeName="number";class ThreeQuaternionLinearInterpolant extends ThreeInterpolant{constructor(t,e,i,s){super(t,e,i,s);}interpolate_(t,e,i,s){const n=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e);let c=t*a;for(let h=c+a;c!==h;c+=4)ThreeQuaternion.slerpFlat(n,0,o,c-a,o,c,l);return n;}}class ThreeQuaternionKeyframeTrack extends ThreeKeyframeTrack{constructor(t,e,i,s){super(t,e,i,s);}InterpolantFactoryMethodLinear(t){return new ThreeQuaternionLinearInterpolant(this.times,this.values,this.getValueSize(),t);}}ThreeQuaternionKeyframeTrack.prototype.ValueTypeName="quaternion";ThreeQuaternionKeyframeTrack.prototype.InterpolantFactoryMethodSmooth=void 0;class ThreeStringKeyframeTrack extends ThreeKeyframeTrack{constructor(t,e,i){super(t,e,i);}}ThreeStringKeyframeTrack.prototype.ValueTypeName="string";ThreeStringKeyframeTrack.prototype.ValueBufferType=Array;ThreeStringKeyframeTrack.prototype.DefaultInterpolation=ThreeInterpolateDiscrete;ThreeStringKeyframeTrack.prototype.InterpolantFactoryMethodLinear=void 0;ThreeStringKeyframeTrack.prototype.InterpolantFactoryMethodSmooth=void 0;class ThreeVectorKeyframeTrack extends ThreeKeyframeTrack{constructor(t,e,i,s){super(t,e,i,s);}}ThreeVectorKeyframeTrack.prototype.ValueTypeName="vector";class ThreeAnimationClip{constructor(t="",e=-1,i=[],s=ThreeNormalAnimationBlendMode){this.name=t,this.tracks=i,this.duration=e,this.blendMode=s,this.uuid=Rs(),this.userData={},this.duration<0&&this.resetDuration();}static parse(t){const e=[],i=t.tracks,s=1/(t.fps||1);for(let o=0,a=i.length;o!==a;++o)e.push(ab(i[o]).scale(s));const n=new this(t.name,t.duration,e,t.blendMode);return n.uuid=t.uuid,n.userData=JSON.parse(t.userData||"{}"),n;}static toJSON(t){const e=[],i=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let n=0,o=i.length;n!==o;++n)e.push(ThreeKeyframeTrack.toJSON(i[n]));return s;}static CreateFromMorphTargetSequence(t,e,i,s){const n=e.length,o=[];for(let a=0;a<n;a++){let l=[],c=[];l.push((a+n-1)%n,a,(a+1)%n),c.push(0,1,0);const h=Qx(l);l=_d(l,1,h),c=_d(c,1,h),!s&&l[0]===0&&(l.push(n),c.push(c[0])),o.push(new ThreeNumberKeyframeTrack(".morphTargetInfluences["+e[a].name+"]",l,c).scale(1/i));}return new this(t,-1,o);}static findByName(t,e){let i=t;if(!Array.isArray(t)){const s=t;i=s.geometry&&s.geometry.animations||s.animations;}for(let s=0;s<i.length;s++)if(i[s].name===e)return i[s];return null;}static CreateClipsFromMorphTargetSequences(t,e,i){const s={},n=/^([\w-]*?)([\d]+)$/;for(let a=0,l=t.length;a<l;a++){const c=t[a],h=c.name.match(n);if(h&&h.length>1){const f=h[1];let u=s[f];u||(s[f]=u=[]),u.push(c);}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],e,i));return o;}resetDuration(){const t=this.tracks;let e=0;for(let i=0,s=t.length;i!==s;++i){const n=this.tracks[i];e=Math.max(e,n.times[n.times.length-1]);}return this.duration=e,this;}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this;}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t;}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this;}clone(){const t=[];for(let i=0;i<this.tracks.length;i++)t.push(this.tracks[i].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e;}toJSON(){return this.constructor.toJSON(this);}}function rb(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ThreeNumberKeyframeTrack;case"vector":case"vector2":case"vector3":case"vector4":return ThreeVectorKeyframeTrack;case"color":return ThreeColorKeyframeTrack;case"quaternion":return ThreeQuaternionKeyframeTrack;case"bool":case"boolean":return ThreeBooleanKeyframeTrack;case"string":return ThreeStringKeyframeTrack;}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r);}function ab(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=rb(r.type);if(r.times===void 0){const i=[],s=[];ty(r.keys,i,s,"value"),r.times=i,r.values=s;}let e;return t.parse!==void 0?e=t.parse(r):e=new t(r.name,r.times,r.values,r.interpolation),kl(r.settings)&&(e.settings={inTangents:an(r.settings.inTangents,Float32Array),outTangents:an(r.settings.outTangents,Float32Array)}),e;}const ThreeCache={enabled:!1,files:{},add:function(r,t){this.enabled!==!1&&(Hm(r)||(this.files[r]=t));},get:function(r){if(this.enabled!==!1&&!Hm(r))return this.files[r];},remove:function(r){delete this.files[r];},clear:function(){this.files={};}};function Hm(r){try{const t=r.slice(r.indexOf(":")+1);return new URL(t).protocol==="blob:";}catch{return!1;}}class ThreeLoadingManager{constructor(t,e,i){const s=this;let n=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,n===!1&&s.onStart!==void 0&&s.onStart(h,o,a),n=!0;},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(n=!1,s.onLoad!==void 0&&s.onLoad());},this.itemError=function(h){s.onError!==void 0&&s.onError(h);},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h;},this.setURLModifier=function(h){return l=h,this;},this.addHandler=function(h,f){return c.push(h,f),this;},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this;},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){const d=c[f],p=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return p;}return null;},this.abort=function(){return this.abortController.abort(),this._abortController=null,this;};}get abortController(){return this._abortController||(this._abortController=new AbortController()),this._abortController;}}const ThreeDefaultLoadingManager=new ThreeLoadingManager();class ThreeLoader{constructor(t){this.manager=t!==void 0?t:ThreeDefaultLoadingManager,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}));}load(){}loadAsync(t,e){const i=this;return new Promise(function(s,n){i.load(t,s,e,n);});}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this;}setWithCredentials(t){return this.withCredentials=t,this;}setPath(t){return this.path=t,this;}setResourcePath(t){return this.resourcePath=t,this;}setRequestHeader(t){return this.requestHeader=t,this;}abort(){return this;}}ThreeLoader.DEFAULT_MATERIAL_NAME="__DEFAULT";const qn={};class lb extends Error{constructor(t,e){super(t),this.response=e;}}class ThreeFileLoader extends ThreeLoader{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController();}load(t,e,i,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const n=ThreeCache.get(`file:${t}`);if(n!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(n),this.manager.itemEnd(t);},0);return;}if(qn[t]!==void 0){qn[t].push({onLoad:e,onProgress:i,onError:s});return;}qn[t]=[],qn[t].push({onLoad:e,onProgress:i,onError:s});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Threewarn("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=qn[t],f=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=u?parseInt(u):0,p=d!==0;let v=0;const g=new ReadableStream({start(x){m();function m(){f.read().then(({done:w,value:y})=>{if(w)x.close();else{v+=y.byteLength;const _=new ProgressEvent("progress",{lengthComputable:p,loaded:v,total:d});for(let M=0,A=h.length;M<A;M++){const b=h[M];b.onProgress&&b.onProgress(_);}x.enqueue(y),m();}},w=>{x.error(w);});}}});return new Response(g);}else throw new lb(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c);}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(a),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return c.arrayBuffer().then(p=>d.decode(p));}}}).then(c=>{ThreeCache.add(`file:${t}`,c);const h=qn[t];delete qn[t];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onLoad&&d.onLoad(c);}}).catch(c=>{const h=qn[t];if(h===void 0)throw this.manager.itemError(t),c;delete qn[t];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onError&&d.onError(c);}this.manager.itemError(t);}).finally(()=>{this.manager.itemEnd(t);}),this.manager.itemStart(t);}setResponseType(t){return this.responseType=t,this;}setMimeType(t){return this.mimeType=t,this;}abort(){return this._abortController.abort(),this._abortController=new AbortController(),this;}}class ThreeAnimationLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=this,o=new ThreeFileLoader(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(a){try{e(n.parse(JSON.parse(a)));}catch(l){s?s(l):Threeerror(l),n.manager.itemError(t);}},i,s);}parse(t){const e=[];for(let i=0;i<t.length;i++){const s=ThreeAnimationClip.parse(t[i]);e.push(s);}return e;}}class ThreeCompressedTextureLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=this,o=[],a=new ThreeCompressedTexture(),l=new ThreeFileLoader(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(n.withCredentials);let c=0;function h(f){l.load(t[f],function(u){const d=n.parse(u,!0);o[f]={width:d.width,height:d.height,format:d.format,mipmaps:d.mipmaps},c+=1,c===6&&(d.mipmapCount===1&&(a.minFilter=ThreeLinearFilter),a.image=o,a.format=d.format,a.needsUpdate=!0,e&&e(a));},i,s);}if(Array.isArray(t))for(let f=0,u=t.length;f<u;++f)h(f);else l.load(t,function(f){const u=n.parse(f,!0);if(u.isCubemap){const d=u.mipmaps.length/u.mipmapCount;for(let p=0;p<d;p++){o[p]={mipmaps:[]};for(let v=0;v<u.mipmapCount;v++)o[p].mipmaps.push(u.mipmaps[p*u.mipmapCount+v]),o[p].format=u.format,o[p].width=u.width,o[p].height=u.height;}a.image=o;}else a.image.width=u.width,a.image.height=u.height,a.mipmaps=u.mipmaps;u.mipmapCount===1&&(a.minFilter=ThreeLinearFilter),a.format=u.format,a.needsUpdate=!0,e&&e(a);},i,s);return a;}}const Zr=new WeakMap();class ThreeImageLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const n=this,o=ThreeCache.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)n.manager.itemStart(t),setTimeout(function(){e&&e(o),n.manager.itemEnd(t);},0);else{let f=Zr.get(o);f===void 0&&(f=[],Zr.set(o,f)),f.push({onLoad:e,onError:s});}return o;}const a=ql("img");function l(){h(),e&&e(this);const f=Zr.get(this)||[];for(let u=0;u<f.length;u++){const d=f[u];d.onLoad&&d.onLoad(this);}Zr.delete(this),n.manager.itemEnd(t);}function c(f){h(),s&&s(f),ThreeCache.remove(`image:${t}`);const u=Zr.get(this)||[];for(let d=0;d<u.length;d++){const p=u[d];p.onError&&p.onError(f);}Zr.delete(this),n.manager.itemError(t),n.manager.itemEnd(t);}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1);}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ThreeCache.add(`image:${t}`,a),n.manager.itemStart(t),a.src=t,a;}}class ThreeCubeTextureLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=new ThreeCubeTexture();n.colorSpace=ThreeSRGBColorSpace;const o=new ThreeImageLoader(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function l(c){o.load(t[c],function(h){n.images[c]=h,a++,a===6&&(n.needsUpdate=!0,e&&e(n));},void 0,s);}for(let c=0;c<t.length;++c)l(c);return n;}}class ThreeDataTextureLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=this,o=new ThreeDataTexture(),a=new ThreeFileLoader(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(n.withCredentials),a.load(t,function(l){let c;try{c=n.parse(l);}catch(h){s!==void 0?s(h):Threeerror(h);return;}n._applyTexData(o,c),e&&e(o,c);},i,s),o;}createDataTexture(t){const e=new ThreeDataTexture();return this._applyTexData(e,this.parse(t)),e;}_applyTexData(t,e){e.image!==void 0?t.image=e.image:e.data!==void 0&&(t.image.width=e.width,t.image.height=e.height,t.image.data=e.data),t.wrapS=e.wrapS!==void 0?e.wrapS:ThreeClampToEdgeWrapping,t.wrapT=e.wrapT!==void 0?e.wrapT:ThreeClampToEdgeWrapping,t.magFilter=e.magFilter!==void 0?e.magFilter:ThreeLinearFilter,t.minFilter=e.minFilter!==void 0?e.minFilter:ThreeLinearFilter,t.anisotropy=e.anisotropy!==void 0?e.anisotropy:1,e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.mipmaps!==void 0&&(t.mipmaps=e.mipmaps,t.minFilter=ThreeLinearMipmapLinearFilter),e.mipmapCount===1&&(t.minFilter=ThreeLinearFilter),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),t.needsUpdate=!0;}}class ThreeTextureLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=new ThreeTexture(),o=new ThreeImageLoader(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){n.image=a,n.needsUpdate=!0,e!==void 0&&e(n);},i,s),n;}}class ThreeLight extends ThreeObject3D{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ThreeColor(t),this.intensity=e;}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this;}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e;}}class ThreeHemisphereLight extends ThreeLight{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ThreeObject3D.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ThreeColor(e);}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this;}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e;}}const pf=new ThreeMatrix4();const Wm=new ThreeVector3();const qm=new ThreeVector3();class ThreeLightShadow{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ThreeVector2(512,512),this.mapType=ThreeUnsignedByteType,this.map=null,this.mapPass=null,this.matrix=new ThreeMatrix4(),this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ThreeFrustum(),this._frameExtents=new ThreeVector2(1,1),this._viewportCount=1,this._viewports=[new ThreeVector4(0,0,1,1)];}getViewportCount(){return this._viewportCount;}getCamera(){return this.camera;}getFrustum(){return this._frustum;}updateMatrices(t){const e=this.camera;Wm.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wm),qm.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(qm),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum);}_updateMatrix(t,e,i,s){pf.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(pf,t.coordinateSystem,t.reversedDepth);const n=this._frameExtents,o=s?s.z/n.x:1,a=s?s.w/n.y:1,l=s?s.x/n.x:0,c=s?s.y/n.y:0;t.coordinateSystem===ThreeWebGPUCoordinateSystem||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(pf);}getViewport(t){return this._viewports[t];}getFrameExtents(){return this._frameExtents;}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose();}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this;}clone(){return new this.constructor().copy(this);}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t;}}const th=new ThreeVector3();const eh=new ThreeQuaternion();const _n=new ThreeVector3();class ThreeCamera extends ThreeObject3D{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ThreeMatrix4(),this.projectionMatrix=new ThreeMatrix4(),this.projectionMatrixInverse=new ThreeMatrix4(),this.coordinateSystem=ThreeWebGLCoordinateSystem,this._reversedDepth=!1;}get reversedDepth(){return this._reversedDepth;}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this;}getWorldDirection(t){return super.getWorldDirection(t).negate();}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(th,eh,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(th,eh,_n.set(1,1,1)).invert();}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(th,eh,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(th,eh,_n.set(1,1,1)).invert();}clone(){return new this.constructor().copy(this);}}const xo=new ThreeVector3();const Xm=new ThreeVector2();const Ym=new ThreeVector2();class ThreePerspectiveCamera extends ThreeCamera{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix();}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this;}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ta*2*Math.atan(e),this.updateProjectionMatrix();}getFocalLength(){const t=Math.tan(pr*.5*this.fov);return .5*this.getFilmHeight()/t;}getEffectiveFOV(){return Ta*2*Math.atan(Math.tan(pr*.5*this.fov)/this.zoom);}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1);}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1);}getViewBounds(t,e,i){xo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(xo.x,xo.y).multiplyScalar(-t/xo.z),xo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(xo.x,xo.y).multiplyScalar(-t/xo.z);}getViewSize(t,e){return this.getViewBounds(t,Xm,Ym),e.subVectors(Ym,Xm);}setViewOffset(t,e,i,s,n,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=n,this.view.height=o,this.updateProjectionMatrix();}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix();}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(pr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,n=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;n+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c;}const a=this.filmOffset;a!==0&&(n+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(n,n+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert();}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e;}}class pb extends ThreeLightShadow{constructor(){super(new ThreePerspectiveCamera(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1;}updateMatrices(t){const e=this.camera,i=Ta*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,n=t.distance||e.far;(i!==e.fov||s!==e.aspect||n!==e.far)&&(e.fov=i,e.aspect=s,e.far=n,e.updateProjectionMatrix()),super.updateMatrices(t);}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this;}toJSON(){const t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t;}}class ThreeSpotLight extends ThreeLight{constructor(t,e,i=0,s=Math.PI/3,n=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ThreeObject3D.DEFAULT_UP),this.updateMatrix(),this.target=new ThreeObject3D(),this.distance=i,this.angle=s,this.penumbra=n,this.decay=o,this.map=null,this.shadow=new pb();}get power(){return this.intensity*Math.PI;}set power(t){this.intensity=t/Math.PI;}dispose(){super.dispose(),this.shadow.dispose();}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this;}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e;}}class mb extends ThreeLightShadow{constructor(){super(new ThreePerspectiveCamera(90,1,.5,500)),this.isPointLightShadow=!0;}}class ThreePointLight extends ThreeLight{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new mb();}get power(){return this.intensity*4*Math.PI;}set power(t){this.intensity=t/(4*Math.PI);}dispose(){super.dispose(),this.shadow.dispose();}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this;}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e;}}class ThreeOrthographicCamera extends ThreeCamera{constructor(t=-1,e=1,i=1,s=-1,n=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=n,this.far=o,this.updateProjectionMatrix();}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this;}setViewOffset(t,e,i,s,n,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=n,this.view.height=o,this.updateProjectionMatrix();}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix();}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let n=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;n+=c*this.view.offsetX,o=n+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height;}this.projectionMatrix.makeOrthographic(n,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert();}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e;}}class gb extends ThreeLightShadow{constructor(){super(new ThreeOrthographicCamera(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0;}}class ThreeDirectionalLight extends ThreeLight{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ThreeObject3D.DEFAULT_UP),this.updateMatrix(),this.target=new ThreeObject3D(),this.shadow=new gb();}dispose(){super.dispose(),this.shadow.dispose();}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this;}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e;}}class ThreeAmbientLight extends ThreeLight{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight";}}class ThreeRectAreaLight extends ThreeLight{constructor(t,e,i=10,s=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=i,this.height=s;}get power(){return this.intensity*this.width*this.height*Math.PI;}set power(t){this.intensity=t/(this.width*this.height*Math.PI);}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this;}toJSON(t){const e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e;}}class ThreeSphericalHarmonics3{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let t=0;t<9;t++)this.coefficients.push(new ThreeVector3());}set(t){for(let e=0;e<9;e++)this.coefficients[e].copy(t[e]);return this;}zero(){for(let t=0;t<9;t++)this.coefficients[t].set(0,0,0);return this;}getAt(t,e){const i=t.x,s=t.y,n=t.z,o=this.coefficients;return e.copy(o[0]).multiplyScalar(.282095),e.addScaledVector(o[1],.488603*s),e.addScaledVector(o[2],.488603*n),e.addScaledVector(o[3],.488603*i),e.addScaledVector(o[4],1.092548*(i*s)),e.addScaledVector(o[5],1.092548*(s*n)),e.addScaledVector(o[6],.315392*(3*n*n-1)),e.addScaledVector(o[7],1.092548*(i*n)),e.addScaledVector(o[8],.546274*(i*i-s*s)),e;}getIrradianceAt(t,e){const i=t.x,s=t.y,n=t.z,o=this.coefficients;return e.copy(o[0]).multiplyScalar(.886227),e.addScaledVector(o[1],2*.511664*s),e.addScaledVector(o[2],2*.511664*n),e.addScaledVector(o[3],2*.511664*i),e.addScaledVector(o[4],2*.429043*i*s),e.addScaledVector(o[5],2*.429043*s*n),e.addScaledVector(o[6],.743125*n*n-.247708),e.addScaledVector(o[7],2*.429043*i*n),e.addScaledVector(o[8],.429043*(i*i-s*s)),e;}add(t){for(let e=0;e<9;e++)this.coefficients[e].add(t.coefficients[e]);return this;}addScaledSH(t,e){for(let i=0;i<9;i++)this.coefficients[i].addScaledVector(t.coefficients[i],e);return this;}scale(t){for(let e=0;e<9;e++)this.coefficients[e].multiplyScalar(t);return this;}lerp(t,e){for(let i=0;i<9;i++)this.coefficients[i].lerp(t.coefficients[i],e);return this;}equals(t){for(let e=0;e<9;e++)if(!this.coefficients[e].equals(t.coefficients[e]))return!1;return!0;}copy(t){return this.set(t.coefficients);}clone(){return new this.constructor().copy(this);}fromArray(t,e=0){const i=this.coefficients;for(let s=0;s<9;s++)i[s].fromArray(t,e+s*3);return this;}toArray(t=[],e=0){const i=this.coefficients;for(let s=0;s<9;s++)i[s].toArray(t,e+s*3);return t;}static getBasisAt(t,e){const i=t.x,s=t.y,n=t.z;e[0]=.282095,e[1]=.488603*s,e[2]=.488603*n,e[3]=.488603*i,e[4]=1.092548*i*s,e[5]=1.092548*s*n,e[6]=.315392*(3*n*n-1),e[7]=1.092548*i*n,e[8]=.546274*(i*i-s*s);}}class ThreeLightProbe extends ThreeLight{constructor(t=new ThreeSphericalHarmonics3(),e=1){super(void 0,e),this.isLightProbe=!0,this.sh=t;}copy(t){return super.copy(t),this.sh.copy(t.sh),this;}toJSON(t){const e=super.toJSON(t);return e.object.sh=this.sh.toArray(),e;}}const $m={};class ThreeMaterialLoader extends ThreeLoader{constructor(t){super(t),this.textures={};}load(t,e,i,s){const n=this,o=new ThreeFileLoader(n.manager);o.setPath(n.path),o.setRequestHeader(n.requestHeader),o.setWithCredentials(n.withCredentials),o.load(t,function(a){try{e(n.parse(JSON.parse(a)));}catch(l){s?s(l):Threeerror(l),n.manager.itemError(t);}},i,s);}parse(t){const e=this.createMaterialFromType(t.type);return e.fromJSON(t,this.textures),e;}setTextures(t){return this.textures=t,this;}createMaterialFromType(t){return ThreeMaterialLoader.createMaterialFromType(t);}static createMaterialFromType(t){const i={ShadowMaterial:ThreeShadowMaterial,SpriteMaterial:ThreeSpriteMaterial,RawShaderMaterial:ThreeRawShaderMaterial,ShaderMaterial:ThreeShaderMaterial,PointsMaterial:ThreePointsMaterial,MeshPhysicalMaterial:ThreeMeshPhysicalMaterial,MeshStandardMaterial:ThreeMeshStandardMaterial,MeshPhongMaterial:ThreeMeshPhongMaterial,MeshToonMaterial:ThreeMeshToonMaterial,MeshNormalMaterial:ThreeMeshNormalMaterial,MeshLambertMaterial:ThreeMeshLambertMaterial,MeshDepthMaterial:ThreeMeshDepthMaterial,MeshDistanceMaterial:ThreeMeshDistanceMaterial,MeshBasicMaterial:ThreeMeshBasicMaterial,MeshMatcapMaterial:ThreeMeshMatcapMaterial,LineDashedMaterial:ThreeLineDashedMaterial,LineBasicMaterial:ThreeLineBasicMaterial,Material:ThreeMaterial,...$m}[t];let s;return i===void 0?(ThreewarnOnce(`MaterialLoader: Unknown material type "${t}". Use .registerMaterial() before starting the deserialization process.`),s=new ThreeMaterial()):s=new i(),s;}static registerMaterial(t,e){$m[t]=e;}}class ThreeLoaderUtils{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1);}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t);}}class ThreeInstancedBufferGeometry extends ThreeBufferGeometry{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0;}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this;}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t;}}class ThreeBufferGeometryLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=this,o=new ThreeFileLoader(n.manager);o.setPath(n.path),o.setRequestHeader(n.requestHeader),o.setWithCredentials(n.withCredentials),o.load(t,function(a){try{e(n.parse(JSON.parse(a)));}catch(l){s?s(l):Threeerror(l),n.manager.itemError(t);}},i,s);}parse(t){const e={},i={};function s(d,p){if(e[p]!==void 0)return e[p];const g=d.interleavedBuffers[p],x=n(d,g.buffer),m=pa(g.type,x),w=new ThreeInterleavedBuffer(m,g.stride);return w.uuid=g.uuid,g.usage!==void 0&&w.setUsage(g.usage),e[p]=w,w;}function n(d,p){if(i[p]!==void 0)return i[p];const g=d.arrayBuffers[p],x=new Uint32Array(g).buffer;return i[p]=x,x;}const o=t.isInstancedBufferGeometry?new ThreeInstancedBufferGeometry():new ThreeBufferGeometry(),a=t.data.index;if(a!==void 0){const d=pa(a.type,a.array);o.setIndex(new ThreeBufferAttribute(d,1));}const l=t.data.attributes;for(const d in l){const p=l[d];let v;if(p.isInterleavedBufferAttribute){const g=s(t.data,p.data);v=new ThreeInterleavedBufferAttribute(g,p.itemSize,p.offset,p.normalized);}else{const g=pa(p.type,p.array),x=p.isInstancedBufferAttribute?ThreeInstancedBufferAttribute:ThreeBufferAttribute;v=new x(g,p.itemSize,p.normalized);}p.name!==void 0&&(v.name=p.name),p.usage!==void 0&&v.setUsage(p.usage),p.gpuType!==void 0&&(v.gpuType=p.gpuType),o.setAttribute(d,v);}const c=t.data.morphAttributes;if(c)for(const d in c){const p=c[d],v=[];for(let g=0,x=p.length;g<x;g++){const m=p[g];let w;if(m.isInterleavedBufferAttribute){const y=s(t.data,m.data);w=new ThreeInterleavedBufferAttribute(y,m.itemSize,m.offset,m.normalized);}else{const y=pa(m.type,m.array);w=new ThreeBufferAttribute(y,m.itemSize,m.normalized);}m.name!==void 0&&(w.name=m.name),m.usage!==void 0&&w.setUsage(m.usage),m.gpuType!==void 0&&(w.gpuType=m.gpuType),v.push(w);}o.morphAttributes[d]=v;}t.data.morphTargetsRelative&&(o.morphTargetsRelative=!0);const f=t.data.groups||t.data.drawcalls||t.data.offsets;if(f!==void 0)for(let d=0,p=f.length;d!==p;++d){const v=f[d];o.addGroup(v.start,v.count,v.materialIndex);}const u=t.data.boundingSphere;return u!==void 0&&(o.boundingSphere=new ThreeSphere().fromJSON(u)),t.name&&(o.name=t.name),t.userData&&(o.userData=t.userData),o;}}const mf={};class ThreeObjectLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=this,o=this.path===""?ThreeLoaderUtils.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||o;const a=new ThreeFileLoader(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(l){let c=null;try{c=JSON.parse(l);}catch(f){s!==void 0&&s(f),Threeerror("ObjectLoader: Can't parse "+t+".",f.message);return;}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){s!==void 0&&s(new Error("THREE.ObjectLoader: Can't load "+t)),Threeerror("ObjectLoader: Can't load "+t);return;}n.parse(c,e);},i,s);}async loadAsync(t,e){const i=this,s=this.path===""?ThreeLoaderUtils.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||s;const n=new ThreeFileLoader(this.manager);n.setPath(this.path),n.setRequestHeader(this.requestHeader),n.setWithCredentials(this.withCredentials);const o=await n.loadAsync(t,e);let a;try{a=JSON.parse(o);}catch(c){throw new Error("THREE.ObjectLoader: Can't parse "+t+". "+c.message);}const l=a.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+t);return await i.parseAsync(a);}parse(t,e){const i=this.parseAnimations(t.animations),s=this.parseShapes(t.shapes),n=this.parseGeometries(t.geometries,s),o=this.parseImages(t.images,function(){e!==void 0&&e(c);}),a=this.parseTextures(t.textures,o),l=this.parseMaterials(t.materials,a),c=this.parseObject(t.object,n,l,a,i),h=this.parseSkeletons(t.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),e!==void 0){let f=!1;for(const u in o)if(o[u].data instanceof HTMLImageElement){f=!0;break;}f===!1&&e(c);}return c;}async parseAsync(t){const e=this.parseAnimations(t.animations),i=this.parseShapes(t.shapes),s=this.parseGeometries(t.geometries,i),n=await this.parseImagesAsync(t.images),o=this.parseTextures(t.textures,n),a=this.parseMaterials(t.materials,o),l=this.parseObject(t.object,s,a,o,e),c=this.parseSkeletons(t.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l;}static registerGeometry(t,e){mf[t]=e;}parseShapes(t){const e={};if(t!==void 0)for(let i=0,s=t.length;i<s;i++){const n=new ThreeShape().fromJSON(t[i]);e[n.uuid]=n;}return e;}parseSkeletons(t,e){const i={},s={};if(e.traverse(function(n){n.isBone&&(s[n.uuid]=n);}),t!==void 0)for(let n=0,o=t.length;n<o;n++){const a=new ThreeSkeleton().fromJSON(t[n],s);i[a.uuid]=a;}return i;}parseGeometries(t,e){const i={};if(t!==void 0){const s=new ThreeBufferGeometryLoader();for(let n=0,o=t.length;n<o;n++){let a;const l=t[n];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":a=s.parse(l);break;default:l.type in Bm?a=Bm[l.type].fromJSON(l,e):l.type in mf?a=mf[l.type].fromJSON(l,e):Threewarn(`ObjectLoader: Unknown geometry type "${l.type}". Use .registerGeometry() before starting the deserialization process.`);}a.uuid=l.uuid,l.name!==void 0&&(a.name=l.name),l.userData!==void 0&&(a.userData=l.userData),i[l.uuid]=a;}}return i;}parseMaterials(t,e){const i={},s={};if(t!==void 0){const n=new ThreeMaterialLoader();n.setTextures(e);for(let o=0,a=t.length;o<a;o++){const l=t[o];i[l.uuid]===void 0&&(i[l.uuid]=n.parse(l)),s[l.uuid]=i[l.uuid];}}return s;}parseAnimations(t){const e={};if(t!==void 0)for(let i=0;i<t.length;i++){const s=t[i],n=ThreeAnimationClip.parse(s);e[n.uuid]=n;}return e;}parseImages(t,e){const i=this,s={};let n;function o(l){return l=i.manager.resolveURL(l),i.manager.itemStart(l),n.load(l,function(){i.manager.itemEnd(l);},void 0,function(){i.manager.itemError(l),i.manager.itemEnd(l);});}function a(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:i.resourcePath+c;return o(h);}else return l.data?{data:pa(l.type,l.data),width:l.width,height:l.height}:null;}if(t!==void 0&&t.length>0){const l=new ThreeLoadingManager(e);n=new ThreeImageLoader(l),n.setCrossOrigin(this.crossOrigin);for(let c=0,h=t.length;c<h;c++){const f=t[c],u=f.url;if(Array.isArray(u)){const d=[];for(let p=0,v=u.length;p<v;p++){const g=u[p],x=a(g);x!==null&&(x instanceof HTMLImageElement?d.push(x):d.push(new ThreeDataTexture(x.data,x.width,x.height)));}s[f.uuid]=new ThreeTextureSource(d);}else{const d=a(f.url);s[f.uuid]=new ThreeTextureSource(d);}}}return s;}async parseImagesAsync(t){const e=this,i={};let s;async function n(o){if(typeof o=="string"){const a=o,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:e.resourcePath+a;return await s.loadAsync(l);}else return o.data?{data:pa(o.type,o.data),width:o.width,height:o.height}:null;}if(t!==void 0&&t.length>0){s=new ThreeImageLoader(this.manager),s.setCrossOrigin(this.crossOrigin);for(let o=0,a=t.length;o<a;o++){const l=t[o],c=l.url;if(Array.isArray(c)){const h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f],p=await n(d);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new ThreeDataTexture(p.data,p.width,p.height)));}i[l.uuid]=new ThreeTextureSource(h);}else{const h=await n(l.url);i[l.uuid]=new ThreeTextureSource(h);}}}return i;}parseTextures(t,e){function i(n,o){return typeof n=="number"?n:(Threewarn("ObjectLoader.parseTexture: Constant should be in numeric form.",n),o[n]);}const s={};if(t!==void 0)for(let n=0,o=t.length;n<o;n++){const a=t[n];a.image===void 0&&Threewarn('ObjectLoader: No "image" specified for',a.uuid),e[a.image]===void 0&&Threewarn("ObjectLoader: Undefined image",a.image);const l=e[a.image],c=l.data;let h;Array.isArray(c)?(h=new ThreeCubeTexture(),c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new ThreeDataTexture():h=new ThreeTexture(),c&&(h.needsUpdate=!0)),h.source=l,h.uuid=a.uuid,a.name!==void 0&&(h.name=a.name),a.mapping!==void 0&&(h.mapping=i(a.mapping,xb)),a.channel!==void 0&&(h.channel=a.channel),a.offset!==void 0&&h.offset.fromArray(a.offset),a.repeat!==void 0&&h.repeat.fromArray(a.repeat),a.center!==void 0&&h.center.fromArray(a.center),a.rotation!==void 0&&(h.rotation=a.rotation),a.wrap!==void 0&&(h.wrapS=i(a.wrap[0],Zm),h.wrapT=i(a.wrap[1],Zm)),a.format!==void 0&&(h.format=a.format),a.internalFormat!==void 0&&(h.internalFormat=a.internalFormat),a.type!==void 0&&(h.type=a.type),a.colorSpace!==void 0&&(h.colorSpace=a.colorSpace),a.minFilter!==void 0&&(h.minFilter=i(a.minFilter,jm)),a.magFilter!==void 0&&(h.magFilter=i(a.magFilter,jm)),a.anisotropy!==void 0&&(h.anisotropy=a.anisotropy),a.flipY!==void 0&&(h.flipY=a.flipY),a.generateMipmaps!==void 0&&(h.generateMipmaps=a.generateMipmaps),a.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(h.unpackAlignment=a.unpackAlignment),a.compareFunction!==void 0&&(h.compareFunction=a.compareFunction),a.normalized!==void 0&&(h.normalized=a.normalized),a.userData!==void 0&&(h.userData=a.userData),s[a.uuid]=h;}return s;}parseObject(t,e,i,s,n){let o;function a(u){return e[u]===void 0&&Threewarn("ObjectLoader: Undefined geometry",u),e[u];}function l(u){if(u!==void 0){if(Array.isArray(u)){const d=[];for(let p=0,v=u.length;p<v;p++){const g=u[p];i[g]===void 0&&Threewarn("ObjectLoader: Undefined material",g),d.push(i[g]);}return d;}return i[u]===void 0&&Threewarn("ObjectLoader: Undefined material",u),i[u];}}function c(u){return s[u]===void 0&&Threewarn("ObjectLoader: Undefined texture",u),s[u];}let h,f;switch(t.type){case"Scene":o=new ThreeScene(),t.background!==void 0&&(Number.isInteger(t.background)?o.background=new ThreeColor(t.background):o.background=c(t.background)),t.environment!==void 0&&(o.environment=c(t.environment)),t.fog!==void 0&&(t.fog.type==="Fog"?o.fog=new ThreeFog(t.fog.color,t.fog.near,t.fog.far):t.fog.type==="FogExp2"&&(o.fog=new ThreeFogExp2(t.fog.color,t.fog.density)),t.fog.name!==""&&(o.fog.name=t.fog.name)),t.backgroundBlurriness!==void 0&&(o.backgroundBlurriness=t.backgroundBlurriness),t.backgroundIntensity!==void 0&&(o.backgroundIntensity=t.backgroundIntensity),t.backgroundRotation!==void 0&&o.backgroundRotation.fromArray(t.backgroundRotation),t.environmentIntensity!==void 0&&(o.environmentIntensity=t.environmentIntensity),t.environmentRotation!==void 0&&o.environmentRotation.fromArray(t.environmentRotation);break;case"PerspectiveCamera":o=new ThreePerspectiveCamera(t.fov,t.aspect,t.near,t.far),t.focus!==void 0&&(o.focus=t.focus),t.zoom!==void 0&&(o.zoom=t.zoom),t.filmGauge!==void 0&&(o.filmGauge=t.filmGauge),t.filmOffset!==void 0&&(o.filmOffset=t.filmOffset),t.view!==void 0&&(o.view=Object.assign({},t.view));break;case"OrthographicCamera":o=new ThreeOrthographicCamera(t.left,t.right,t.top,t.bottom,t.near,t.far),t.zoom!==void 0&&(o.zoom=t.zoom),t.view!==void 0&&(o.view=Object.assign({},t.view));break;case"AmbientLight":o=new ThreeAmbientLight(t.color,t.intensity);break;case"DirectionalLight":o=new ThreeDirectionalLight(t.color,t.intensity),o.target=t.target||"";break;case"PointLight":o=new ThreePointLight(t.color,t.intensity,t.distance,t.decay);break;case"RectAreaLight":o=new ThreeRectAreaLight(t.color,t.intensity,t.width,t.height);break;case"SpotLight":o=new ThreeSpotLight(t.color,t.intensity,t.distance,t.angle,t.penumbra,t.decay),o.target=t.target||"";break;case"HemisphereLight":o=new ThreeHemisphereLight(t.color,t.groundColor,t.intensity);break;case"LightProbe":const u=new ThreeSphericalHarmonics3().fromArray(t.sh);o=new ThreeLightProbe(u,t.intensity);break;case"SkinnedMesh":h=a(t.geometry),f=l(t.material),o=new ThreeSkinnedMesh(h,f),t.bindMode!==void 0&&(o.bindMode=t.bindMode),t.bindMatrix!==void 0&&o.bindMatrix.fromArray(t.bindMatrix),t.skeleton!==void 0&&(o.skeleton=t.skeleton);break;case"Mesh":h=a(t.geometry),f=l(t.material),o=new ThreeMesh(h,f);break;case"InstancedMesh":h=a(t.geometry),f=l(t.material);const d=t.count,p=t.instanceMatrix,v=t.instanceColor;o=new ThreeInstancedMesh(h,f,d),o.instanceMatrix=new ThreeInstancedBufferAttribute(new Float32Array(p.array),16),v!==void 0&&(o.instanceColor=new ThreeInstancedBufferAttribute(new Float32Array(v.array),v.itemSize));break;case"BatchedMesh":h=a(t.geometry),f=l(t.material),o=new ThreeBatchedMesh(t.maxInstanceCount,t.maxVertexCount,t.maxIndexCount,f),o.geometry=h,o.perObjectFrustumCulled=t.perObjectFrustumCulled,o.sortObjects=t.sortObjects,o._drawRanges=t.drawRanges,o._reservedRanges=t.reservedRanges,o._geometryInfo=t.geometryInfo.map(g=>{let x=null,m=null;return g.boundingBox!==void 0&&(x=new ThreeBox3().fromJSON(g.boundingBox)),g.boundingSphere!==void 0&&(m=new ThreeSphere().fromJSON(g.boundingSphere)),{...g,boundingBox:x,boundingSphere:m};}),o._instanceInfo=t.instanceInfo,o._availableInstanceIds=t._availableInstanceIds,o._availableGeometryIds=t._availableGeometryIds,o._nextIndexStart=t.nextIndexStart,o._nextVertexStart=t.nextVertexStart,o._geometryCount=t.geometryCount,o._maxInstanceCount=t.maxInstanceCount,o._maxVertexCount=t.maxVertexCount,o._maxIndexCount=t.maxIndexCount,o._geometryInitialized=t.geometryInitialized,o._matricesTexture=c(t.matricesTexture.uuid),o._indirectTexture=c(t.indirectTexture.uuid),t.colorsTexture!==void 0&&(o._colorsTexture=c(t.colorsTexture.uuid)),t.boundingSphere!==void 0&&(o.boundingSphere=new ThreeSphere().fromJSON(t.boundingSphere)),t.boundingBox!==void 0&&(o.boundingBox=new ThreeBox3().fromJSON(t.boundingBox));break;case"LOD":o=new ThreeLOD();break;case"Line":o=new ThreeLine(a(t.geometry),l(t.material));break;case"LineLoop":o=new ThreeLineLoop(a(t.geometry),l(t.material));break;case"LineSegments":o=new ThreeLineSegments(a(t.geometry),l(t.material));break;case"PointCloud":case"Points":o=new ThreePoints(a(t.geometry),l(t.material));break;case"Sprite":o=new ThreeSprite(l(t.material));break;case"Group":o=new ThreeGroup();break;case"Bone":o=new ThreeBone();break;default:o=new ThreeObject3D();}if(o.uuid=t.uuid,t.name!==void 0&&(o.name=t.name),t.matrix!==void 0?(o.matrix.fromArray(t.matrix),t.matrixAutoUpdate!==void 0&&(o.matrixAutoUpdate=t.matrixAutoUpdate),o.matrixAutoUpdate&&o.matrix.decompose(o.position,o.quaternion,o.scale)):(t.position!==void 0&&o.position.fromArray(t.position),t.rotation!==void 0&&o.rotation.fromArray(t.rotation),t.quaternion!==void 0&&o.quaternion.fromArray(t.quaternion),t.scale!==void 0&&o.scale.fromArray(t.scale)),t.up!==void 0&&o.up.fromArray(t.up),t.pivot!==void 0&&(o.pivot=new ThreeVector3().fromArray(t.pivot)),t.morphTargetDictionary!==void 0&&(o.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),t.morphTargetInfluences!==void 0&&(o.morphTargetInfluences=t.morphTargetInfluences.slice()),t.castShadow!==void 0&&(o.castShadow=t.castShadow),t.receiveShadow!==void 0&&(o.receiveShadow=t.receiveShadow),t.shadow&&(t.shadow.intensity!==void 0&&(o.shadow.intensity=t.shadow.intensity),t.shadow.bias!==void 0&&(o.shadow.bias=t.shadow.bias),t.shadow.normalBias!==void 0&&(o.shadow.normalBias=t.shadow.normalBias),t.shadow.radius!==void 0&&(o.shadow.radius=t.shadow.radius),t.shadow.blurSamples!==void 0&&(o.shadow.blurSamples=t.shadow.blurSamples),t.shadow.focus!==void 0&&(o.shadow.focus=t.shadow.focus),t.shadow.aspect!==void 0&&(o.shadow.aspect=t.shadow.aspect),t.shadow.mapSize!==void 0&&o.shadow.mapSize.fromArray(t.shadow.mapSize),t.shadow.camera!==void 0&&(o.shadow.camera=this.parseObject(t.shadow.camera))),t.visible!==void 0&&(o.visible=t.visible),t.frustumCulled!==void 0&&(o.frustumCulled=t.frustumCulled),t.renderOrder!==void 0&&(o.renderOrder=t.renderOrder),t.static!==void 0&&(o.static=t.static),t.userData!==void 0&&(o.userData=t.userData),t.layers!==void 0&&(o.layers.mask=t.layers),t.children!==void 0){const u=t.children;for(let d=0;d<u.length;d++)o.add(this.parseObject(u[d],e,i,s,n));}if(t.animations!==void 0){const u=t.animations;for(let d=0;d<u.length;d++){const p=u[d];o.animations.push(n[p]);}}if(t.type==="LOD"){t.autoUpdate!==void 0&&(o.autoUpdate=t.autoUpdate);const u=t.levels;for(let d=0;d<u.length;d++){const p=u[d],v=o.getObjectByProperty("uuid",p.object);v!==void 0&&o.addLevel(v,p.distance,p.hysteresis);}}return o;}bindSkeletons(t,e){Object.keys(e).length!==0&&t.traverse(function(i){if(i.isSkinnedMesh===!0&&i.skeleton!==void 0){const s=e[i.skeleton];s===void 0?Threewarn("ObjectLoader: No skeleton found with UUID:",i.skeleton):i.bind(s,i.bindMatrix);}});}bindLightTargets(t){t.traverse(function(e){if(e.isDirectionalLight||e.isSpotLight){const i=e.target,s=t.getObjectByProperty("uuid",i);s!==void 0?e.target=s:e.target=new ThreeObject3D();}});}}const xb={UVMapping:ThreeUVMapping,CubeReflectionMapping:ThreeCubeReflectionMapping,CubeRefractionMapping:ThreeCubeRefractionMapping,EquirectangularReflectionMapping:ThreeEquirectangularReflectionMapping,EquirectangularRefractionMapping:ThreeEquirectangularRefractionMapping,CubeUVReflectionMapping:ThreeCubeUVReflectionMapping};const Zm={RepeatWrapping:ThreeRepeatWrapping,ClampToEdgeWrapping:ThreeClampToEdgeWrapping,MirroredRepeatWrapping:ThreeMirroredRepeatWrapping};const jm={NearestFilter:ThreeNearestFilter,NearestMipmapNearestFilter:ThreeNearestMipmapNearestFilter,NearestMipmapLinearFilter:ThreeNearestMipmapLinearFilter,LinearFilter:ThreeLinearFilter,LinearMipmapNearestFilter:ThreeLinearMipmapNearestFilter,LinearMipmapLinearFilter:ThreeLinearMipmapLinearFilter};const gf=new WeakMap();class ThreeImageBitmapLoader extends ThreeLoader{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Threewarn("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Threewarn("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController();}setOptions(t){return this.options=t,this;}load(t,e,i,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const n=this,o=ThreeCache.get(`image-bitmap:${t}`);if(o!==void 0){if(n.manager.itemStart(t),o.then){o.then(c=>{gf.has(o)===!0?(s&&s(gf.get(o)),n.manager.itemError(t),n.manager.itemEnd(t)):(e&&e(c),n.manager.itemEnd(t));});return;}setTimeout(function(){e&&e(o),n.manager.itemEnd(t);},0);return;}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(t,a).then(function(c){return c.blob();}).then(function(c){return createImageBitmap(c,Object.assign({},n.options,{colorSpaceConversion:"none"}));}).then(function(c){return ThreeCache.add(`image-bitmap:${t}`,c),e&&e(c),n.manager.itemEnd(t),c;}).catch(function(c){s&&s(c),gf.set(l,c),ThreeCache.remove(`image-bitmap:${t}`),n.manager.itemError(t),n.manager.itemEnd(t);});ThreeCache.add(`image-bitmap:${t}`,l),n.manager.itemStart(t);}abort(){return this._abortController.abort(),this._abortController=new AbortController(),this;}}let ih;class ThreeAudioContext{static getContext(){return ih===void 0&&(ih=new(window.AudioContext||window.webkitAudioContext)()),ih;}static setContext(t){ih=t;}}class ThreeAudioLoader extends ThreeLoader{constructor(t){super(t);}load(t,e,i,s){const n=this,o=new ThreeFileLoader(this.manager);o.setResponseType("arraybuffer"),o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(l){try{const c=l.slice(0),h=ThreeAudioContext.getContext(),f=t+"#decode";n.manager.itemStart(f),h.decodeAudioData(c,function(u){e(u),n.manager.itemEnd(f);}).catch(function(u){a(u),n.manager.itemEnd(f);});}catch(c){a(c);}},i,s);function a(l){s?s(l):Threeerror(l),n.manager.itemError(t);}}}const Km=new ThreeMatrix4();const Jm=new ThreeMatrix4();const Xo=new ThreeMatrix4();class ThreeStereoCamera{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new ThreePerspectiveCamera(),this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new ThreePerspectiveCamera(),this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null};}update(t){const e=this._cache;if(e.focus!==t.focus||e.fov!==t.fov||e.aspect!==t.aspect*this.aspect||e.near!==t.near||e.far!==t.far||e.zoom!==t.zoom||e.eyeSep!==this.eyeSep){e.focus=t.focus,e.fov=t.fov,e.aspect=t.aspect*this.aspect,e.near=t.near,e.far=t.far,e.zoom=t.zoom,e.eyeSep=this.eyeSep,Xo.copy(t.projectionMatrix);const s=e.eyeSep/2,n=s*e.near/e.focus,o=e.near*Math.tan(pr*e.fov*.5)/e.zoom;let a,l;Jm.elements[12]=-s,Km.elements[12]=s,a=-o*e.aspect+n,l=o*e.aspect+n,Xo.elements[0]=2*e.near/(l-a),Xo.elements[8]=(l+a)/(l-a),this.cameraL.projectionMatrix.copy(Xo),a=-o*e.aspect-n,l=o*e.aspect-n,Xo.elements[0]=2*e.near/(l-a),Xo.elements[8]=(l+a)/(l-a),this.cameraR.projectionMatrix.copy(Xo);}this.cameraL.matrix.copy(t.matrixWorld).multiply(Jm),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(t.matrixWorld).multiply(Km),this.cameraR.matrixWorldNeedsUpdate=!0;}}const jr=-90;const Kr=1;class ThreeCubeCamera extends ThreeObject3D{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ThreePerspectiveCamera(jr,Kr,t,e);s.layers=this.layers,this.add(s);const n=new ThreePerspectiveCamera(jr,Kr,t,e);n.layers=this.layers,this.add(n);const o=new ThreePerspectiveCamera(jr,Kr,t,e);o.layers=this.layers,this.add(o);const a=new ThreePerspectiveCamera(jr,Kr,t,e);a.layers=this.layers,this.add(a);const l=new ThreePerspectiveCamera(jr,Kr,t,e);l.layers=this.layers,this.add(l);const c=new ThreePerspectiveCamera(jr,Kr,t,e);c.layers=this.layers,this.add(c);}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,n,o,a,l]=e;for(const c of e)this.remove(c);if(t===ThreeWebGLCoordinateSystem)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),n.up.set(0,0,-1),n.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ThreeWebGPUCoordinateSystem)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),n.up.set(0,0,1),n.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld();}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[n,o,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,n),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0;}}class ThreeArrayCamera extends ThreePerspectiveCamera{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t;}}class ThreeTimer{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null;}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=bb.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1));}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null;}getDelta(){return this._delta/1e3;}getElapsed(){return this._elapsed/1e3;}getTimescale(){return this._timescale;}setTimescale(t){return this._timescale=t,this;}reset(){return this._currentTime=performance.now()-this._startTime,this;}dispose(){this.disconnect();}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this;}}function bb(){this._document.hidden===!1&&this.reset();}const Yo=new ThreeVector3();const vf=new ThreeQuaternion();const Mb=new ThreeVector3();const $o=new ThreeVector3();const Zo=new ThreeVector3();class ThreeAudioListener extends ThreeObject3D{constructor(){super(),this.type="AudioListener",this.context=ThreeAudioContext.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new ThreeTimer();}getInput(){return this.gain;}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this;}getFilter(){return this.filter;}setFilter(t){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=t,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this;}getMasterVolume(){return this.gain.gain.value;}setMasterVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this;}updateMatrixWorld(t){super.updateMatrixWorld(t),this._timer.update();const e=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(Yo,vf,Mb),$o.set(0,0,-1).applyQuaternion(vf),Zo.set(0,1,0).applyQuaternion(vf),e.positionX){const i=this.context.currentTime+this.timeDelta;e.positionX.linearRampToValueAtTime(Yo.x,i),e.positionY.linearRampToValueAtTime(Yo.y,i),e.positionZ.linearRampToValueAtTime(Yo.z,i),e.forwardX.linearRampToValueAtTime($o.x,i),e.forwardY.linearRampToValueAtTime($o.y,i),e.forwardZ.linearRampToValueAtTime($o.z,i),e.upX.linearRampToValueAtTime(Zo.x,i),e.upY.linearRampToValueAtTime(Zo.y,i),e.upZ.linearRampToValueAtTime(Zo.z,i);}else e.setPosition(Yo.x,Yo.y,Yo.z),e.setOrientation($o.x,$o.y,$o.z,Zo.x,Zo.y,Zo.z);}}let ThreeAudio=class extends ThreeObject3D{constructor(t){super(),this.type="Audio",this.listener=t,this.context=t.context,this.gain=this.context.createGain(),this.gain.connect(t.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[];}getOutput(){return this.gain;}setNodeSource(t){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=t,this.connect(),this;}setMediaElementSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(t),this.connect(),this;}setMediaStreamSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(t),this.connect(),this;}setBuffer(t){return this.buffer=t,this.sourceType="buffer",this.autoplay&&this.play(),this;}play(t=0){if(this.isPlaying===!0){Threewarn("Audio: Audio is already playing.");return;}if(this.hasPlaybackControl===!1){Threewarn("Audio: this Audio has no playback control.");return;}this._startedAt=this.context.currentTime+t;const e=this.context.createBufferSource();return e.buffer=this.buffer,e.loop=this.loop,e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.onended=this.onEnded.bind(this),e.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=e,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect();}pause(){if(this.hasPlaybackControl===!1){Threewarn("Audio: this Audio has no playback control.");return;}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this;}stop(t=0){if(this.hasPlaybackControl===!1){Threewarn("Audio: this Audio has no playback control.");return;}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+t),this.source.onended=null),this.isPlaying=!1,this;}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].connect(this.filters[t]);this.filters[this.filters.length-1].connect(this.getOutput());}else this.source.connect(this.getOutput());return this._connected=!0,this;}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].disconnect(this.filters[t]);this.filters[this.filters.length-1].disconnect(this.getOutput());}else this.source.disconnect(this.getOutput());return this._connected=!1,this;}}getFilters(){return this.filters;}setFilters(t){return t||(t=[]),this._connected===!0?(this.disconnect(),this.filters=t.slice(),this.connect()):this.filters=t.slice(),this;}setDetune(t){return this.detune=t,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this;}getDetune(){return this.detune;}getFilter(){return this.getFilters()[0];}setFilter(t){return this.setFilters(t?[t]:[]);}setPlaybackRate(t){if(this.hasPlaybackControl===!1){Threewarn("Audio: this Audio has no playback control.");return;}return this.playbackRate=t,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this;}getPlaybackRate(){return this.playbackRate;}onEnded(){this.isPlaying=!1,this._progress=0;}getLoop(){return this.hasPlaybackControl===!1?(Threewarn("Audio: this Audio has no playback control."),!1):this.loop;}setLoop(t){if(this.hasPlaybackControl===!1){Threewarn("Audio: this Audio has no playback control.");return;}return this.loop=t,this.isPlaying===!0&&(this.source.loop=this.loop),this;}setLoopStart(t){return this.loopStart=t,this;}setLoopEnd(t){return this.loopEnd=t,this;}getVolume(){return this.gain.gain.value;}setVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this;}copy(t,e){return super.copy(t,e),t.sourceType!=="buffer"?(Threewarn("Audio: Audio source type cannot be copied."),this):(this.autoplay=t.autoplay,this.buffer=t.buffer,this.detune=t.detune,this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.offset=t.offset,this.duration=t.duration,this.playbackRate=t.playbackRate,this.hasPlaybackControl=t.hasPlaybackControl,this.sourceType=t.sourceType,this.filters=t.filters.slice(),this);}clone(t){return new this.constructor(this.listener).copy(this,t);}};const jo=new ThreeVector3();const Qm=new ThreeQuaternion();const Ab=new ThreeVector3();const Ko=new ThreeVector3();class ThreePositionalAudio extends ThreeAudio{constructor(t){super(t),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain);}connect(){return super.connect(),this.panner.connect(this.gain),this;}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this;}getOutput(){return this.panner;}getRefDistance(){return this.panner.refDistance;}setRefDistance(t){return this.panner.refDistance=t,this;}getRolloffFactor(){return this.panner.rolloffFactor;}setRolloffFactor(t){return this.panner.rolloffFactor=t,this;}getDistanceModel(){return this.panner.distanceModel;}setDistanceModel(t){return this.panner.distanceModel=t,this;}getMaxDistance(){return this.panner.maxDistance;}setMaxDistance(t){return this.panner.maxDistance=t,this;}setDirectionalCone(t,e,i){return this.panner.coneInnerAngle=t,this.panner.coneOuterAngle=e,this.panner.coneOuterGain=i,this;}updateMatrixWorld(t){if(super.updateMatrixWorld(t),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(jo,Qm,Ab),Ko.set(0,0,1).applyQuaternion(Qm);const e=this.panner;if(e.positionX){const i=this.context.currentTime+this.listener.timeDelta;e.positionX.linearRampToValueAtTime(jo.x,i),e.positionY.linearRampToValueAtTime(jo.y,i),e.positionZ.linearRampToValueAtTime(jo.z,i),e.orientationX.linearRampToValueAtTime(Ko.x,i),e.orientationY.linearRampToValueAtTime(Ko.y,i),e.orientationZ.linearRampToValueAtTime(Ko.z,i);}else e.setPosition(jo.x,jo.y,jo.z),e.setOrientation(Ko.x,Ko.y,Ko.z);}}class ThreeAudioAnalyser{constructor(t,e=2048){this.analyser=t.context.createAnalyser(),this.analyser.fftSize=e,this.data=new Uint8Array(this.analyser.frequencyBinCount),t.getOutput().connect(this.analyser);}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data;}getAverageFrequency(){let t=0;const e=this.getFrequencyData();for(let i=0;i<e.length;i++)t+=e[i];return t/e.length;}}class ThreePropertyMixer{constructor(t,e,i){this.binding=t,this.valueSize=i;let s,n,o;switch(e){case"quaternion":s=this._slerp,n=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":s=this._select,n=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:s=this._lerp,n=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5);}this._mixBufferRegion=s,this._mixBufferRegionAdditive=n,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0;}accumulate(t,e){const i=this.buffer,s=this.valueSize,n=t*s+s;let o=this.cumulativeWeight;if(o===0){for(let a=0;a!==s;++a)i[n+a]=i[a];o=e;}else{o+=e;const a=e/o;this._mixBufferRegion(i,n,0,a,s);}this.cumulativeWeight=o;}accumulateAdditive(t){const e=this.buffer,i=this.valueSize,s=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,s,0,t,i),this.cumulativeWeightAdditive+=t;}apply(t){const e=this.valueSize,i=this.buffer,s=t*e+e,n=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,n<1){const l=e*this._origIndex;this._mixBufferRegion(i,s,l,1-n,e);}o>0&&this._mixBufferRegionAdditive(i,s,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(i[l]!==i[l+e]){a.setValue(i,s);break;}}saveOriginalState(){const t=this.binding,e=this.buffer,i=this.valueSize,s=i*this._origIndex;t.getValue(e,s);for(let n=i,o=s;n!==o;++n)e[n]=e[s+n%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0;}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t);}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let i=t;i<e;i++)this.buffer[i]=0;}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1;}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[e+i]=this.buffer[t+i];}_select(t,e,i,s,n){if(s>=.5)for(let o=0;o!==n;++o)t[e+o]=t[i+o];}_slerp(t,e,i,s){ThreeQuaternion.slerpFlat(t,e,t,e,t,i,s);}_slerpAdditive(t,e,i,s,n){const o=this._workIndex*n;ThreeQuaternion.multiplyQuaternionsFlat(t,o,t,e,t,i),ThreeQuaternion.slerpFlat(t,e,t,e,t,o,s);}_lerp(t,e,i,s,n){const o=1-s;for(let a=0;a!==n;++a){const l=e+a;t[l]=t[l]*o+t[i+a]*s;}}_lerpAdditive(t,e,i,s,n){for(let o=0;o!==n;++o){const a=e+o;t[a]=t[a]+t[i+o]*s;}}}const Tp="\\[\\]\\.:\\/";const Cb=new RegExp("["+Tp+"]","g");const Ep="[^"+Tp+"]";const Rb="[^"+Tp.replace("\\.","")+"]";const zb=/((?:WC+[\/:])*)/.source.replace("WC",Ep);const Pb=/(WCOD+)?/.source.replace("WCOD",Rb);const Lb=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ep);const Ib=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ep);const kb=new RegExp("^"+zb+Pb+Lb+Ib+"$");const Db=["material","materials","bones","map"];class Fb{constructor(t,e,i){const s=i||ThreePropertyBinding.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s);}getValue(t,e){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e);}setValue(t,e){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,n=i.length;s!==n;++s)i[s].setValue(t,e);}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind();}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind();}}class ThreePropertyBinding{constructor(t,e,i){this.path=e,this.parsedPath=i||ThreePropertyBinding.parseTrackName(e),this.node=ThreePropertyBinding.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound;}static create(t,e,i){return t&&t.isAnimationObjectGroup?new ThreePropertyBinding.Composite(t,e,i):new ThreePropertyBinding(t,e,i);}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Cb,"");}static parseTrackName(t){const e=kb.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);const i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const n=i.nodeName.substring(s+1);Db.indexOf(n)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=n);}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i;}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const i=t.skeleton.getBoneByName(e);if(i!==void 0)return i;}if(t.children){const i=function(n){for(let o=0;o<n.length;o++){const a=n[o];if(a.name===e||a.uuid===e)return a;const l=i(a.children);if(l)return l;}return null;},s=i(t.children);if(s)return s;}return null;}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName];}_getValue_array(t,e){const i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)t[e++]=i[s];}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex];}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e);}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e];}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0;}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0;}_setValue_array(t,e){const i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)i[s]=t[e++];}_setValue_array_setNeedsUpdate(t,e){const i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0;}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0;}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e];}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0;}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0;}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e);}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0;}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0;}_getValue_unbound(t,e){this.bind(),this.getValue(t,e);}_setValue_unbound(t,e){this.bind(),this.setValue(t,e);}bind(){let t=this.node;const e=this.parsedPath,i=e.objectName,s=e.propertyName;let n=e.propertyIndex;if(t||(t=ThreePropertyBinding.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Threewarn("PropertyBinding: No target node found for track: "+this.path+".");return;}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){Threeerror("PropertyBinding: Can not bind to material as node does not have a material.",this);return;}if(!t.material.materials){Threeerror("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return;}t=t.material.materials;break;case"bones":if(!t.skeleton){Threeerror("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return;}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break;}break;case"map":if("map"in t){t=t.map;break;}if(!t.material){Threeerror("PropertyBinding: Can not bind to material as node does not have a material.",this);return;}if(!t.material.map){Threeerror("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return;}t=t.material.map;break;default:if(t[i]===void 0){Threeerror("PropertyBinding: Can not bind to objectName of node undefined.",this);return;}t=t[i];}if(c!==void 0){if(t[c]===void 0){Threeerror("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return;}t=t[c];}}const o=t[s];if(o===void 0){const c=e.nodeName;Threeerror("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return;}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Threeerror("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return;}if(!t.geometry.morphAttributes){Threeerror("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return;}t.morphTargetDictionary[n]!==void 0&&(n=t.morphTargetDictionary[n]);}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=n;}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a];}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound;}}ThreePropertyBinding.Composite=Fb;ThreePropertyBinding.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ThreePropertyBinding.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ThreePropertyBinding.prototype.GetterByBindingType=[ThreePropertyBinding.prototype._getValue_direct,ThreePropertyBinding.prototype._getValue_array,ThreePropertyBinding.prototype._getValue_arrayElement,ThreePropertyBinding.prototype._getValue_toArray];ThreePropertyBinding.prototype.SetterByBindingTypeAndVersioning=[[ThreePropertyBinding.prototype._setValue_direct,ThreePropertyBinding.prototype._setValue_direct_setNeedsUpdate,ThreePropertyBinding.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ThreePropertyBinding.prototype._setValue_array,ThreePropertyBinding.prototype._setValue_array_setNeedsUpdate,ThreePropertyBinding.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ThreePropertyBinding.prototype._setValue_arrayElement,ThreePropertyBinding.prototype._setValue_arrayElement_setNeedsUpdate,ThreePropertyBinding.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ThreePropertyBinding.prototype._setValue_fromArray,ThreePropertyBinding.prototype._setValue_fromArray_setNeedsUpdate,ThreePropertyBinding.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class ThreeAnimationObjectGroup{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Rs(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const t={};this._indicesByUUID=t;for(let i=0,s=arguments.length;i!==s;++i)t[arguments[i].uuid]=i;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const e=this;this.stats={objects:{get total(){return e._objects.length;},get inUse(){return this.total-e.nCachedObjects_;}},get bindingsPerObject(){return e._bindings.length;}};}add(){const t=this._objects,e=this._indicesByUUID,i=this._paths,s=this._parsedPaths,n=this._bindings,o=n.length;let a,l=t.length,c=this.nCachedObjects_;for(let h=0,f=arguments.length;h!==f;++h){const u=arguments[h],d=u.uuid;let p=e[d];if(p===void 0){p=l++,e[d]=p,t.push(u);for(let v=0,g=o;v!==g;++v)n[v].push(new ThreePropertyBinding(u,i[v],s[v]));}else if(p<c){a=t[p];const v=--c,g=t[v];e[g.uuid]=p,t[p]=g,e[d]=v,t[v]=u;for(let x=0,m=o;x!==m;++x){const w=n[x],y=w[v];let _=w[p];w[p]=y,_===void 0&&(_=new ThreePropertyBinding(u,i[x],s[x])),w[v]=_;}}else t[p]!==a&&Threeerror("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.");}this.nCachedObjects_=c;}remove(){const t=this._objects,e=this._indicesByUUID,i=this._bindings,s=i.length;let n=this.nCachedObjects_;for(let o=0,a=arguments.length;o!==a;++o){const l=arguments[o],c=l.uuid,h=e[c];if(h!==void 0&&h>=n){const f=n++,u=t[f];e[u.uuid]=h,t[h]=u,e[c]=f,t[f]=l;for(let d=0,p=s;d!==p;++d){const v=i[d],g=v[f],x=v[h];v[h]=g,v[f]=x;}}}this.nCachedObjects_=n;}uncache(){const t=this._objects,e=this._indicesByUUID,i=this._bindings,s=i.length;let n=this.nCachedObjects_,o=t.length;for(let a=0,l=arguments.length;a!==l;++a){const c=arguments[a],h=c.uuid,f=e[h];if(f!==void 0)if(delete e[h],f<n){const u=--n,d=t[u],p=--o,v=t[p];f!==u&&(e[d.uuid]=f),t[f]=d,u!==p&&(e[v.uuid]=u),t[u]=v,t.pop();for(let g=0,x=s;g!==x;++g){const m=i[g],w=m[u],y=m[p];m[f]=w,m[u]=y,m.pop();}}else{const u=--o,d=t[u];f!==u&&(e[d.uuid]=f),t[f]=d,t.pop();for(let p=0,v=s;p!==v;++p){const g=i[p];g[f]=g[u],g.pop();}}}this.nCachedObjects_=n;}subscribe_(t,e){const i=this._bindingsIndicesByPath;let s=i[t];const n=this._bindings;if(s!==void 0)return n[s];const o=this._paths,a=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,f=new Array(c);s=n.length,i[t]=s,o.push(t),a.push(e),n.push(f);for(let u=h,d=l.length;u!==d;++u){const p=l[u];f[u]=new ThreePropertyBinding(p,t,e);}return f;}unsubscribe_(t){const e=this._bindingsIndicesByPath,i=e[t];if(i!==void 0){const s=this._paths,n=this._parsedPaths,o=this._bindings,a=o.length-1,l=o[a],c=s[a];e[c]=i,o[i]=l,o.pop(),n[i]=n[a],n.pop(),s[i]=s[a],s.pop();}}}class ThreeAnimationAction{constructor(t,e,i=null,s=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=i,this.blendMode=s;const n=e.tracks,o=n.length,a=new Array(o),l={endingStart:ThreeZeroCurvatureEnding,endingEnd:ThreeZeroCurvatureEnding};for(let c=0;c!==o;++c){const h=n[c].createInterpolant(null);a[c]=h,h.settings=l;}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=ThreeLoopRepeat,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0;}play(){return this._mixer._activateAction(this),this;}stop(){return this._mixer._deactivateAction(this),this.reset();}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping();}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this);}isScheduled(){return this._mixer._isActiveAction(this);}startAt(t){return this._startTime=t,this;}setLoop(t,e){return this.loop=t,this.repetitions=e,this;}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading();}getEffectiveWeight(){return this._effectiveWeight;}fadeIn(t){return this._scheduleFading(t,0,1);}fadeOut(t){return this._scheduleFading(t,1,0);}crossFadeFrom(t,e,i=!1){if(t.fadeOut(e),this.fadeIn(e),i===!0){const s=this._clip.duration,n=t._clip.duration,o=n/s,a=s/n;t._restoreTimeScale=t.timeScale,this._restoreTimeScale=this.timeScale,t.warp(1,o,e),this.warp(a,1,e);}return this;}crossFadeTo(t,e,i=!1){return t.crossFadeFrom(this,e,i);}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this;}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping();}getEffectiveTimeScale(){return this._effectiveTimeScale;}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping();}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping();}halt(t){return this.warp(this._effectiveTimeScale,0,t);}warp(t,e,i){const s=this._mixer,n=s.time,o=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=s._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=n,l[1]=n+i,c[0]=t/o,c[1]=e/o,this;}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this._restoreTimeScale=null,this;}getMixer(){return this._mixer;}getClip(){return this._clip;}getRoot(){return this._localRoot||this._mixer._root;}_update(t,e,i,s){if(!this.enabled){this._updateWeight(t);return;}const n=this._startTime;if(n!==null){const l=(t-n)*i;l<0||i===0?e=0:(this._startTime=null,e=i*l);}e*=this._updateTimeScale(t);const o=this._updateTime(e),a=this._updateWeight(t);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case ThreeAdditiveAnimationBlendMode:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(o),c[h].accumulateAdditive(a);break;case ThreeNormalAnimationBlendMode:default:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(o),c[h].accumulate(s,a);}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const i=this._weightInterpolant;if(i!==null){const s=i.evaluate(t)[0];e*=s,t>i.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1));}}return this._effectiveWeight=e,e;}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const s=i.evaluate(t)[0];e*=s,t>i.parameterPositions[1]&&(e===0?this.paused=!0:(this._restoreTimeScale!==null&&(e=this._restoreTimeScale),this.timeScale=e),this.stopWarping());}}return this._effectiveTimeScale=e,e;}_updateTime(t){const e=this._clip.duration,i=this.loop;let s=this.time+t,n=this._loopCount;const o=i===ThreeLoopPingPong;if(t===0)return n===-1?s:o&&(n&1)===1?e-s:s;if(i===ThreeLoopOnce){n===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(s>=e)s=e;else if(s<0)s=0;else{this.time=s;break t;}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1});}}else{if(n===-1&&(t>=0?(n=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),s>=e||s<0){const a=Math.floor(s/e);s-=e*a,n+=Math.abs(a);const l=this.repetitions-n;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=t>0?e:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){const c=t<0;this._setEndings(c,!c,o);}else this._setEndings(!1,!1,o);this._loopCount=n,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a});}}else this._loopCount=n,this.time=s;if(o&&(n&1)===1)return e-s;}return s;}_setEndings(t,e,i){const s=this._interpolantSettings;i?(s.endingStart=ThreeZeroSlopeEnding,s.endingEnd=ThreeZeroSlopeEnding):(t?s.endingStart=this.zeroSlopeAtStart?ThreeZeroSlopeEnding:ThreeZeroCurvatureEnding:s.endingStart=ThreeWrapAroundEnding,e?s.endingEnd=this.zeroSlopeAtEnd?ThreeZeroSlopeEnding:ThreeZeroCurvatureEnding:s.endingEnd=ThreeWrapAroundEnding);}_scheduleFading(t,e,i){const s=this._mixer,n=s.time;let o=this._weightInterpolant;o===null&&(o=s._lendControlInterpolant(),this._weightInterpolant=o);const a=o.parameterPositions,l=o.sampleValues;return a[0]=n,l[0]=e,a[1]=n+t,l[1]=i,this;}}const Ub=new Float32Array(1);class ThreeAnimationMixer extends ThreeEventDispatcher{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}));}_bindAction(t,e){const i=t._localRoot||this._root,s=t._clip.tracks,n=s.length,o=t._propertyBindings,a=t._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let f=0;f!==n;++f){const u=s[f],d=u.name;let p=h[d];if(p!==void 0)++p.referenceCount,o[f]=p;else{if(p=o[f],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,d));continue;}const v=e&&e._propertyBindings[f].binding.parsedPath;p=new ThreePropertyMixer(ThreePropertyBinding.create(i,d,v),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,d),o[f]=p;}a[f].resultBuffer=p.buffer;}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const i=(t._localRoot||this._root).uuid,s=t._clip.uuid,n=this._actionsByClip[s];this._bindAction(t,n&&n.knownActions[0]),this._addInactiveAction(t,s,i);}const e=t._propertyBindings;for(let i=0,s=e.length;i!==s;++i){const n=e[i];n.useCount++===0&&(this._lendBinding(n),n.saveOriginalState());}this._lendAction(t);}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let i=0,s=e.length;i!==s;++i){const n=e[i];--n.useCount===0&&(n.restoreOriginalState(),this._takeBackBinding(n));}this._takeBackAction(t);}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length;},get inUse(){return t._nActiveActions;}},bindings:{get total(){return t._bindings.length;},get inUse(){return t._nActiveBindings;}},controlInterpolants:{get total(){return t._controlInterpolants.length;},get inUse(){return t._nActiveControlInterpolants;}}};}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions;}_addInactiveAction(t,e,i){const s=this._actions,n=this._actionsByClip;let o=n[e];if(o===void 0)o={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,n[e]=o;else{const a=o.knownActions;t._byClipCacheIndex=a.length,a.push(t);}t._cacheIndex=s.length,s.push(t),o.actionByRoot[i]=t;}_removeInactiveAction(t){const e=this._actions,i=e[e.length-1],s=t._cacheIndex;i._cacheIndex=s,e[s]=i,e.pop(),t._cacheIndex=null;const n=t._clip.uuid,o=this._actionsByClip,a=o[n],l=a.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;const f=a.actionByRoot,u=(t._localRoot||this._root).uuid;delete f[u],l.length===0&&delete o[n],this._removeInactiveBindingsForAction(t);}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let i=0,s=e.length;i!==s;++i){const n=e[i];--n.referenceCount===0&&this._removeInactiveBinding(n);}}_lendAction(t){const e=this._actions,i=t._cacheIndex,s=this._nActiveActions++,n=e[s];t._cacheIndex=s,e[s]=t,n._cacheIndex=i,e[i]=n;}_takeBackAction(t){const e=this._actions,i=t._cacheIndex,s=--this._nActiveActions,n=e[s];t._cacheIndex=s,e[s]=t,n._cacheIndex=i,e[i]=n;}_addInactiveBinding(t,e,i){const s=this._bindingsByRootAndName,n=this._bindings;let o=s[e];o===void 0&&(o={},s[e]=o),o[i]=t,t._cacheIndex=n.length,n.push(t);}_removeInactiveBinding(t){const e=this._bindings,i=t.binding,s=i.rootNode.uuid,n=i.path,o=this._bindingsByRootAndName,a=o[s],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete a[n],Object.keys(a).length===0&&delete o[s];}_lendBinding(t){const e=this._bindings,i=t._cacheIndex,s=this._nActiveBindings++,n=e[s];t._cacheIndex=s,e[s]=t,n._cacheIndex=i,e[i]=n;}_takeBackBinding(t){const e=this._bindings,i=t._cacheIndex,s=--this._nActiveBindings,n=e[s];t._cacheIndex=s,e[s]=t,n._cacheIndex=i,e[i]=n;}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let i=t[e];return i===void 0&&(i=new ThreeLinearInterpolant(new Float32Array(2),new Float32Array(2),1,Ub),i.__cacheIndex=e,t[e]=i),i;}_takeBackControlInterpolant(t){const e=this._controlInterpolants,i=t.__cacheIndex,s=--this._nActiveControlInterpolants,n=e[s];t.__cacheIndex=s,e[s]=t,n.__cacheIndex=i,e[i]=n;}clipAction(t,e,i){const s=e||this._root,n=s.uuid;let o=typeof t=="string"?ThreeAnimationClip.findByName(s,t):t;const a=o!==null?o.uuid:t,l=this._actionsByClip[a];let c=null;if(i===void 0&&(o!==null?i=o.blendMode:i=ThreeNormalAnimationBlendMode),l!==void 0){const f=l.actionByRoot[n];if(f!==void 0&&f.blendMode===i)return f;c=l.knownActions[0],o===null&&(o=c._clip);}if(o===null)return null;const h=new ThreeAnimationAction(this,o,e,i);return this._bindAction(h,c),this._addInactiveAction(h,a,n),h;}existingAction(t,e){const i=e||this._root,s=i.uuid,n=typeof t=="string"?ThreeAnimationClip.findByName(i,t):t,o=n?n.uuid:t,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[s]||null;}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let i=e-1;i>=0;--i)t[i].stop();return this;}update(t){t*=this.timeScale;const e=this._actions,i=this._nActiveActions,s=this.time+=t,n=Math.sign(t),o=this._accuIndex^=1;for(let c=0;c!==i;++c)e[c]._update(s,t,n,o);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this;}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t);}getRoot(){return this._root;}uncacheClip(t){const e=this._actions,i=t.uuid,s=this._actionsByClip,n=s[i];if(n!==void 0){const o=n.knownActions;for(let a=0,l=o.length;a!==l;++a){const c=o[a];this._deactivateAction(c);const h=c._cacheIndex,f=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,f._cacheIndex=h,e[h]=f,e.pop(),this._removeInactiveBindingsForAction(c);}delete s[i];}}uncacheRoot(t){const e=t.uuid,i=this._actionsByClip;for(const o in i){const a=i[o].actionByRoot,l=a[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l));}const s=this._bindingsByRootAndName,n=s[e];if(n!==void 0)for(const o in n){const a=n[o];a.restoreOriginalState(),this._removeInactiveBinding(a);}}uncacheAction(t,e){const i=this.existingAction(t,e);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i));}}class ThreeRenderTarget3D extends ThreeRenderTarget{constructor(t=1,e=1,i=1,s={}){super(t,e,s),this.isRenderTarget3D=!0,this.depth=i;for(let n=0;n<this.textures.length;n++){const o=new ThreeData3DTexture(null,t,e,i);o.isRenderTargetTexture=!0,o.renderTarget=this,this.textures[n]=o;}this._setTextureOptions(s);}}class ThreeUniform{constructor(t){this.value=t;}clone(){return new ThreeUniform(this.value.clone===void 0?this.value:this.value.clone());}}let Vb=0;class ThreeUniformsGroup extends ThreeEventDispatcher{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:Vb++}),this.name="",this.usage=ThreeStaticDrawUsage,this.uniforms=[];}add(t){return this.uniforms.push(t),this;}remove(t){const e=this.uniforms.indexOf(t);return e!==-1&&this.uniforms.splice(e,1),this;}setName(t){return this.name=t,this;}setUsage(t){return this.usage=t,this;}dispose(){this.dispatchEvent({type:"dispose"});}copy(t){this.name=t.name,this.usage=t.usage;const e=t.uniforms;this.uniforms.length=0;for(let i=0,s=e.length;i<s;i++){const n=Array.isArray(e[i])?e[i]:[e[i]];for(let o=0;o<n.length;o++)this.uniforms.push(n[o].clone());}return this;}clone(){return new this.constructor().copy(this);}}class ThreeInstancedInterleavedBuffer extends ThreeInterleavedBuffer{constructor(t,e,i=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i;}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this;}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e;}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e;}}class ThreeGLBufferAttribute{constructor(t,e,i,s,n,o=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=t,this.type=e,this.itemSize=i,this.elementSize=s,this.count=n,this.normalized=o,this.version=0;}set needsUpdate(t){t===!0&&this.version++;}setBuffer(t){return this.buffer=t,this;}setType(t,e){return this.type=t,this.elementSize=e,this;}setItemSize(t){return this.itemSize=t,this;}setCount(t){return this.count=t,this;}}const tg=new ThreeMatrix4();class ThreeRaycaster{constructor(t,e,i=0,s=1/0){this.ray=new ThreeRay(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new ThreeLayers(),this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}};}set(t,e){this.ray.set(t,e);}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Threeerror("Raycaster: Unsupported camera type: "+e.type);}setFromXRController(t){return tg.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tg),this;}intersectObject(t,e=!0,i=[]){return Md(t,this,i,e),i.sort(eg),i;}intersectObjects(t,e=!0,i=[]){for(let s=0,n=t.length;s<n;s++)Md(t[s],this,i,e);return i.sort(eg),i;}}function eg(r,t){return r.distance-t.distance;}function Md(r,t,e,i){let s=!0;if(r.layers.test(t.layers)&&r.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const n=r.children;for(let o=0,a=n.length;o<a;o++)Md(n[o],t,e,!0);}}class ThreeClock{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Threewarn("Clock: This module has been deprecated. Please use THREE.Timer instead.");}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0;}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1;}getElapsedTime(){return this.getDelta(),this.elapsedTime;}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t;}return t;}}class ThreeSpherical{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i;}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this;}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this;}makeSafe(){return this.phi=ge(this.phi,1e-6,Math.PI-1e-6),this;}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z);}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(ge(e/this.radius,-1,1))),this;}clone(){return new this.constructor().copy(this);}}class ThreeCylindrical{constructor(t=1,e=0,i=0){this.radius=t,this.theta=e,this.y=i;}set(t,e,i){return this.radius=t,this.theta=e,this.y=i,this;}copy(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this;}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z);}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+i*i),this.theta=Math.atan2(t,i),this.y=e,this;}clone(){return new this.constructor().copy(this);}}const Gp=class Gp{constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s);}identity(){return this.set(1,0,0,1),this;}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this;}set(t,e,i,s){const n=this.elements;return n[0]=t,n[2]=e,n[1]=i,n[3]=s,this;}};Gp.prototype.isMatrix2=!0;let ThreeMatrix2=Gp;const ig=new ThreeVector2();class ThreeBox2{constructor(t=new ThreeVector2(1/0,1/0),e=new ThreeVector2(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e;}set(t,e){return this.min.copy(t),this.max.copy(e),this;}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this;}setFromCenterAndSize(t,e){const i=ig.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this;}clone(){return new this.constructor().copy(this);}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this;}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this;}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y;}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5);}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min);}expandByPoint(t){return this.min.min(t),this.max.max(t),this;}expandByVector(t){return this.min.sub(t),this.max.add(t),this;}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this;}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y;}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y;}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y));}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y;}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max);}distanceToPoint(t){return this.clampPoint(t,ig).distanceTo(t);}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this;}union(t){return this.min.min(t.min),this.max.max(t.max),this;}translate(t){return this.min.add(t),this.max.add(t),this;}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max);}}const sg=new ThreeVector3();const sh=new ThreeVector3();const Jr=new ThreeVector3();const Qr=new ThreeVector3();const xf=new ThreeVector3();const $b=new ThreeVector3();const Zb=new ThreeVector3();class ThreeLine3{constructor(t=new ThreeVector3(),e=new ThreeVector3()){this.start=t,this.end=e;}set(t,e){return this.start.copy(t),this.end.copy(e),this;}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this;}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5);}delta(t){return t.subVectors(this.end,this.start);}distanceSq(){return this.start.distanceToSquared(this.end);}distance(){return this.start.distanceTo(this.end);}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start);}closestPointToPointParameter(t,e){sg.subVectors(t,this.start),sh.subVectors(this.end,this.start);const i=sh.dot(sh);if(i===0)return 0;let n=sh.dot(sg)/i;return e&&(n=ge(n,0,1)),n;}closestPointToPoint(t,e,i){const s=this.closestPointToPointParameter(t,e);return this.delta(i).multiplyScalar(s).add(this.start);}distanceSqToLine3(t,e=$b,i=Zb){const s=10000000000000001e-32;let n,o;const a=this.start,l=t.start,c=this.end,h=t.end;Jr.subVectors(c,a),Qr.subVectors(h,l),xf.subVectors(a,l);const f=Jr.dot(Jr),u=Qr.dot(Qr),d=Qr.dot(xf);if(f<=s&&u<=s)return e.copy(a),i.copy(l),e.sub(i),e.dot(e);if(f<=s)n=0,o=d/u,o=ge(o,0,1);else{const p=Jr.dot(xf);if(u<=s)o=0,n=ge(-p/f,0,1);else{const v=Jr.dot(Qr),g=f*u-v*v;g!==0?n=ge((v*d-p*u)/g,0,1):n=0,o=(v*n+d)/u,o<0?(o=0,n=ge(-p/f,0,1)):o>1&&(o=1,n=ge((v-p)/f,0,1));}}return e.copy(a).addScaledVector(Jr,n),i.copy(l).addScaledVector(Qr,o),e.distanceToSquared(i);}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this;}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end);}clone(){return new this.constructor().copy(this);}}const ng=new ThreeVector3();class ThreeSpotLightHelper extends ThreeObject3D{constructor(t,e){super(),this.light=t,this.matrixAutoUpdate=!1,this.color=e,this.type="SpotLightHelper";const i=new ThreeBufferGeometry(),s=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let o=0,a=1,l=32;o<l;o++,a++){const c=o/l*Math.PI*2,h=a/l*Math.PI*2;s.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1);}i.setAttribute("position",new ThreeFloat32BufferAttribute(s,3));const n=new ThreeLineBasicMaterial({fog:!1,toneMapped:!1});this.cone=new ThreeLineSegments(i,n),this.add(this.cone),this.update();}dispose(){super.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose();}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;const t=this.light.distance?this.light.distance:1e3,e=t*Math.tan(this.light.angle);this.cone.scale.set(e,e,t),ng.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(ng),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color);}}const yo=new ThreeVector3();const nh=new ThreeMatrix4();const yf=new ThreeMatrix4();class ThreeSkeletonHelper extends ThreeLineSegments{constructor(t){const e=yy(t),i=new ThreeBufferGeometry(),s=[],n=[];for(let c=0;c<e.length;c++){const h=e[c];h.parent&&h.parent.isBone&&(s.push(0,0,0),s.push(0,0,0),n.push(0,0,0),n.push(0,0,0));}i.setAttribute("position",new ThreeFloat32BufferAttribute(s,3)),i.setAttribute("color",new ThreeFloat32BufferAttribute(n,3));const o=new ThreeLineBasicMaterial({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(i,o),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1;const a=new ThreeColor(255),l=new ThreeColor(65280);this.setColors(a,l);}updateMatrixWorld(t){const e=this.bones,i=this.geometry,s=i.getAttribute("position");yf.copy(this.root.matrixWorld).invert();for(let n=0,o=0;n<e.length;n++){const a=e[n];a.parent&&a.parent.isBone&&(nh.multiplyMatrices(yf,a.matrixWorld),yo.setFromMatrixPosition(nh),s.setXYZ(o,yo.x,yo.y,yo.z),nh.multiplyMatrices(yf,a.parent.matrixWorld),yo.setFromMatrixPosition(nh),s.setXYZ(o+1,yo.x,yo.y,yo.z),o+=2);}i.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t);}setColors(t,e){const s=this.geometry.getAttribute("color");for(let n=0;n<s.count;n+=2)s.setXYZ(n,t.r,t.g,t.b),s.setXYZ(n+1,e.r,e.g,e.b);return s.needsUpdate=!0,this;}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}}function yy(r){const t=[];r.isBone===!0&&t.push(r);for(let e=0;e<r.children.length;e++)t.push(...yy(r.children[e]));return t;}class ThreePointLightHelper extends ThreeMesh{constructor(t,e,i){const s=new ThreeSphereGeometry(e,4,2),n=new ThreeMeshBasicMaterial({wireframe:!0,fog:!1,toneMapped:!1});super(s,n),this.light=t,this.color=i,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update();}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color);}}const tM=new ThreeVector3();const og=new ThreeColor();const rg=new ThreeColor();class ThreeHemisphereLightHelper extends ThreeObject3D{constructor(t,e,i){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="HemisphereLightHelper";const s=new ThreeOctahedronGeometry(e);s.rotateY(Math.PI*.5),this.material=new ThreeMeshBasicMaterial({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const n=s.getAttribute("position"),o=new Float32Array(n.count*3);s.setAttribute("color",new ThreeBufferAttribute(o,3)),this.add(new ThreeMesh(s,this.material)),this.update();}dispose(){super.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose();}update(){const t=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const e=t.geometry.getAttribute("color");og.copy(this.light.color),rg.copy(this.light.groundColor);for(let i=0,s=e.count;i<s;i++){const n=i<s/2?og:rg;e.setXYZ(i,n.r,n.g,n.b);}e.needsUpdate=!0;}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),t.lookAt(tM.setFromMatrixPosition(this.light.matrixWorld).negate());}}class ThreeGridHelper extends ThreeLineSegments{constructor(t=10,e=10,i=4473924,s=8947848){i=new ThreeColor(i),s=new ThreeColor(s);const n=e/2,o=t/e,a=t/2,l=[],c=[];for(let u=0,d=0,p=-a;u<=e;u++,p+=o){l.push(-a,0,p,a,0,p),l.push(p,0,-a,p,0,a);const v=u===n?i:s;v.toArray(c,d),d+=3,v.toArray(c,d),d+=3,v.toArray(c,d),d+=3,v.toArray(c,d),d+=3;}const h=new ThreeBufferGeometry();h.setAttribute("position",new ThreeFloat32BufferAttribute(l,3)),h.setAttribute("color",new ThreeFloat32BufferAttribute(c,3));const f=new ThreeLineBasicMaterial({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper";}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}}class ThreePolarGridHelper extends ThreeLineSegments{constructor(t=10,e=16,i=8,s=64,n=4473924,o=8947848){n=new ThreeColor(n),o=new ThreeColor(o);const a=[],l=[];if(e>1)for(let f=0;f<e;f++){const u=f/e*(Math.PI*2),d=Math.sin(u)*t,p=Math.cos(u)*t;a.push(0,0,0),a.push(d,0,p);const v=f&1?n:o;l.push(v.r,v.g,v.b),l.push(v.r,v.g,v.b);}for(let f=0;f<i;f++){const u=f&1?n:o,d=t-t/i*f;for(let p=0;p<s;p++){let v=p/s*(Math.PI*2),g=Math.sin(v)*d,x=Math.cos(v)*d;a.push(g,0,x),l.push(u.r,u.g,u.b),v=(p+1)/s*(Math.PI*2),g=Math.sin(v)*d,x=Math.cos(v)*d,a.push(g,0,x),l.push(u.r,u.g,u.b);}}const c=new ThreeBufferGeometry();c.setAttribute("position",new ThreeFloat32BufferAttribute(a,3)),c.setAttribute("color",new ThreeFloat32BufferAttribute(l,3));const h=new ThreeLineBasicMaterial({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper";}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}}const ag=new ThreeVector3();const oh=new ThreeVector3();const lg=new ThreeVector3();class ThreeDirectionalLightHelper extends ThreeObject3D{constructor(t,e,i){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="DirectionalLightHelper",e===void 0&&(e=1);let s=new ThreeBufferGeometry();s.setAttribute("position",new ThreeFloat32BufferAttribute([-e,e,0,e,e,0,e,-e,0,-e,-e,0,-e,e,0],3));const n=new ThreeLineBasicMaterial({fog:!1,toneMapped:!1});this.lightPlane=new ThreeLine(s,n),this.add(this.lightPlane),s=new ThreeBufferGeometry(),s.setAttribute("position",new ThreeFloat32BufferAttribute([0,0,0,0,0,1],3)),this.targetLine=new ThreeLine(s,n),this.add(this.targetLine),this.update();}dispose(){super.dispose(),this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose();}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),ag.setFromMatrixPosition(this.light.matrixWorld),oh.setFromMatrixPosition(this.light.target.matrixWorld),lg.subVectors(oh,ag),this.lightPlane.lookAt(oh),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(oh),this.targetLine.scale.z=lg.length();}}const rh=new ThreeVector3();const ci=new ThreeCamera();class ThreeCameraHelper extends ThreeLineSegments{constructor(t){const e=new ThreeBufferGeometry(),i=new ThreeLineBasicMaterial({color:16777215,vertexColors:!0,toneMapped:!1}),s=[],n=[],o={};a("n1","n2"),a("n2","n4"),a("n4","n3"),a("n3","n1"),a("f1","f2"),a("f2","f4"),a("f4","f3"),a("f3","f1"),a("n1","f1"),a("n2","f2"),a("n3","f3"),a("n4","f4"),a("p","n1"),a("p","n2"),a("p","n3"),a("p","n4"),a("u1","u2"),a("u2","u3"),a("u3","u1"),a("c","t"),a("p","c"),a("cn1","cn2"),a("cn3","cn4"),a("cf1","cf2"),a("cf3","cf4");function a(p,v){l(p),l(v);}function l(p){s.push(0,0,0),n.push(0,0,0),o[p]===void 0&&(o[p]=[]),o[p].push(s.length/3-1);}e.setAttribute("position",new ThreeFloat32BufferAttribute(s,3)),e.setAttribute("color",new ThreeFloat32BufferAttribute(n,3)),super(e,i),this.type="CameraHelper",this.camera=t,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=o,this.update();const c=new ThreeColor(16755200),h=new ThreeColor(16711680),f=new ThreeColor(43775),u=new ThreeColor(16777215),d=new ThreeColor(3355443);this.setColors(c,h,f,u,d);}setColors(t,e,i,s,n){const a=this.geometry.getAttribute("color");return a.setXYZ(0,t.r,t.g,t.b),a.setXYZ(1,t.r,t.g,t.b),a.setXYZ(2,t.r,t.g,t.b),a.setXYZ(3,t.r,t.g,t.b),a.setXYZ(4,t.r,t.g,t.b),a.setXYZ(5,t.r,t.g,t.b),a.setXYZ(6,t.r,t.g,t.b),a.setXYZ(7,t.r,t.g,t.b),a.setXYZ(8,t.r,t.g,t.b),a.setXYZ(9,t.r,t.g,t.b),a.setXYZ(10,t.r,t.g,t.b),a.setXYZ(11,t.r,t.g,t.b),a.setXYZ(12,t.r,t.g,t.b),a.setXYZ(13,t.r,t.g,t.b),a.setXYZ(14,t.r,t.g,t.b),a.setXYZ(15,t.r,t.g,t.b),a.setXYZ(16,t.r,t.g,t.b),a.setXYZ(17,t.r,t.g,t.b),a.setXYZ(18,t.r,t.g,t.b),a.setXYZ(19,t.r,t.g,t.b),a.setXYZ(20,t.r,t.g,t.b),a.setXYZ(21,t.r,t.g,t.b),a.setXYZ(22,t.r,t.g,t.b),a.setXYZ(23,t.r,t.g,t.b),a.setXYZ(24,e.r,e.g,e.b),a.setXYZ(25,e.r,e.g,e.b),a.setXYZ(26,e.r,e.g,e.b),a.setXYZ(27,e.r,e.g,e.b),a.setXYZ(28,e.r,e.g,e.b),a.setXYZ(29,e.r,e.g,e.b),a.setXYZ(30,e.r,e.g,e.b),a.setXYZ(31,e.r,e.g,e.b),a.setXYZ(32,i.r,i.g,i.b),a.setXYZ(33,i.r,i.g,i.b),a.setXYZ(34,i.r,i.g,i.b),a.setXYZ(35,i.r,i.g,i.b),a.setXYZ(36,i.r,i.g,i.b),a.setXYZ(37,i.r,i.g,i.b),a.setXYZ(38,s.r,s.g,s.b),a.setXYZ(39,s.r,s.g,s.b),a.setXYZ(40,n.r,n.g,n.b),a.setXYZ(41,n.r,n.g,n.b),a.setXYZ(42,n.r,n.g,n.b),a.setXYZ(43,n.r,n.g,n.b),a.setXYZ(44,n.r,n.g,n.b),a.setXYZ(45,n.r,n.g,n.b),a.setXYZ(46,n.r,n.g,n.b),a.setXYZ(47,n.r,n.g,n.b),a.setXYZ(48,n.r,n.g,n.b),a.setXYZ(49,n.r,n.g,n.b),a.needsUpdate=!0,this;}update(){const t=this.geometry,e=this.pointMap,i=1,s=1;let n,o;if(ci.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)n=1,o=0;else if(this.camera.coordinateSystem===ThreeWebGLCoordinateSystem)n=-1,o=1;else if(this.camera.coordinateSystem===ThreeWebGPUCoordinateSystem)n=0,o=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);mi("c",e,t,ci,0,0,n),mi("t",e,t,ci,0,0,o),mi("n1",e,t,ci,-i,-s,n),mi("n2",e,t,ci,i,-s,n),mi("n3",e,t,ci,-i,s,n),mi("n4",e,t,ci,i,s,n),mi("f1",e,t,ci,-i,-s,o),mi("f2",e,t,ci,i,-s,o),mi("f3",e,t,ci,-i,s,o),mi("f4",e,t,ci,i,s,o),mi("u1",e,t,ci,i*.7,s*1.1,n),mi("u2",e,t,ci,-i*.7,s*1.1,n),mi("u3",e,t,ci,0,s*2,n),mi("cf1",e,t,ci,-i,0,o),mi("cf2",e,t,ci,i,0,o),mi("cf3",e,t,ci,0,-s,o),mi("cf4",e,t,ci,0,s,o),mi("cn1",e,t,ci,-i,0,n),mi("cn2",e,t,ci,i,0,n),mi("cn3",e,t,ci,0,-s,n),mi("cn4",e,t,ci,0,s,n),t.getAttribute("position").needsUpdate=!0;}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}}function mi(r,t,e,i,s,n,o){rh.set(s,n,o).unproject(i);const a=t[r];if(a!==void 0){const l=e.getAttribute("position");for(let c=0,h=a.length;c<h;c++)l.setXYZ(a[c],rh.x,rh.y,rh.z);}}const ah=new ThreeBox3();class ThreeBoxHelper extends ThreeLineSegments{constructor(t,e=16776960){const i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=new Float32Array(24),n=new ThreeBufferGeometry();n.setIndex(new ThreeBufferAttribute(i,1)),n.setAttribute("position",new ThreeBufferAttribute(s,3)),super(n,new ThreeLineBasicMaterial({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update();}update(){if(this.object!==void 0&&ah.setFromObject(this.object),ah.isEmpty())return;const t=ah.min,e=ah.max,i=this.geometry.attributes.position,s=i.array;s[0]=e.x,s[1]=e.y,s[2]=e.z,s[3]=t.x,s[4]=e.y,s[5]=e.z,s[6]=t.x,s[7]=t.y,s[8]=e.z,s[9]=e.x,s[10]=t.y,s[11]=e.z,s[12]=e.x,s[13]=e.y,s[14]=t.z,s[15]=t.x,s[16]=e.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=e.x,s[22]=t.y,s[23]=t.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere();}setFromObject(t){return this.object=t,this.update(),this;}copy(t,e){return super.copy(t,e),this.object=t.object,this;}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}}class ThreeBox3Helper extends ThreeLineSegments{constructor(t,e=16776960){const i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],n=new ThreeBufferGeometry();n.setIndex(new ThreeBufferAttribute(i,1)),n.setAttribute("position",new ThreeFloat32BufferAttribute(s,3)),super(n,new ThreeLineBasicMaterial({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere();}updateMatrixWorld(t){const e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t));}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}}class ThreePlaneHelper extends ThreeLine{constructor(t,e=1,i=16776960){const s=i,n=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],o=new ThreeBufferGeometry();o.setAttribute("position",new ThreeFloat32BufferAttribute(n,3)),o.computeBoundingSphere(),super(o,new ThreeLineBasicMaterial({color:s,toneMapped:!1})),this.type="PlaneHelper",this.plane=t,this.size=e;const a=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new ThreeBufferGeometry();l.setAttribute("position",new ThreeFloat32BufferAttribute(a,3)),l.computeBoundingSphere(),this.add(new ThreeMesh(l,new ThreeMeshBasicMaterial({color:s,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})));}updateMatrixWorld(t){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(t);}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose();}}const cg=new ThreeVector3();let lh;let wf;class ThreeArrowHelper extends ThreeObject3D{constructor(t=new ThreeVector3(0,0,1),e=new ThreeVector3(0,0,0),i=1,s=16776960,n=i*.2,o=n*.2){super(),this.type="ArrowHelper",lh===void 0&&(lh=new ThreeBufferGeometry(),lh.setAttribute("position",new ThreeFloat32BufferAttribute([0,0,0,0,1,0],3)),wf=new ThreeConeGeometry(.5,1,5,1),wf.translate(0,-.5,0)),this.position.copy(e),this.line=new ThreeLine(lh,new ThreeLineBasicMaterial({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new ThreeMesh(wf,new ThreeMeshBasicMaterial({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(i,n,o);}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{cg.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(cg,e);}}setLength(t,e=t*.2,i=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(i,e,i),this.cone.position.y=t,this.cone.updateMatrix();}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t);}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this;}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose();}}class ThreeAxesHelper extends ThreeLineSegments{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new ThreeBufferGeometry();s.setAttribute("position",new ThreeFloat32BufferAttribute(e,3)),s.setAttribute("color",new ThreeFloat32BufferAttribute(i,3));const n=new ThreeLineBasicMaterial({vertexColors:!0,toneMapped:!1});super(s,n),this.type="AxesHelper";}setColors(t,e,i){const s=new ThreeColor(),n=this.geometry.attributes.color.array;return s.set(t),s.toArray(n,0),s.toArray(n,3),s.set(e),s.toArray(n,6),s.toArray(n,9),s.set(i),s.toArray(n,12),s.toArray(n,15),this.geometry.attributes.color.needsUpdate=!0,this;}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose();}}class ThreeShapePath{constructor(){this.type="ShapePath",this.color=new ThreeColor(),this.subPaths=[],this.currentPath=null,this.userData={};}moveTo(t,e){return this.currentPath=new ThreePath(),this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this;}lineTo(t,e){return this.currentPath.lineTo(t,e),this;}quadraticCurveTo(t,e,i,s){return this.currentPath.quadraticCurveTo(t,e,i,s),this;}bezierCurveTo(t,e,i,s,n,o){return this.currentPath.bezierCurveTo(t,e,i,s,n,o),this;}splineThru(t){return this.currentPath.splineThru(t),this;}toShapes(){function t(l,c){let h=!1;const f=c.length;for(let u=0,d=f-1;u<f;d=u++){const p=c[u],v=c[d];p.y>l.y!=v.y>l.y&&l.x<(v.x-p.x)*(l.y-p.y)/(v.y-p.y)+p.x&&(h=!h);}return h;}function e(l,c){const h=c.getCenter(new ThreeVector2());if(t(h,l))return h;const f=h.y,u=[],d=l.length;for(let p=0;p<d;p++){const v=l[p],g=l[(p+1)%d];if(v.y>f!=g.y>f){const x=v.x+(f-v.y)*(g.x-v.x)/(g.y-v.y);u.push(x);}}return u.length>1&&(u.sort((p,v)=>p-v),h.x=(u[0]+u[1])/2),h;}let i=this.userData.style&&this.userData.style.fillRule||"nonzero";i!=="nonzero"&&i!=="evenodd"&&(Threewarn('Fill-rule "'+i+'" is not supported, falling back to "nonzero".'),i="nonzero");const s=i==="nonzero"?l=>l!==0:l=>(l&1)!==0,n=[];for(const l of this.subPaths){const c=l.getPoints();if(c.length<3)continue;const h=ThreeShapeUtils.area(c);if(h===0)continue;const f=new ThreeBox2();for(let u=0;u<c.length;u++)f.expandByPoint(c[u]);n.push({subPath:l,points:c,boundingBox:f,interiorPoint:e(c,f),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null});}n.sort((l,c)=>c.absArea-l.absArea);for(let l=0;l<n.length;l++){const c=n[l];let h=0;for(let f=l-1;f>=0;f--){const u=n[f];if(u.boundingBox.containsBox(c.boundingBox)&&t(c.interiorPoint,u.points)){c.container=u.exclude?u.container:u,h=u.winding,c.winding+=h;break;}}s(c.winding)===s(h)&&(c.exclude=!0);}for(const l of n)l.exclude||(l.role=l.container===null||l.container.role==="hole"?"outer":"hole");const o=[],a=new Map();for(const l of n){if(l.exclude||l.role!=="outer")continue;const c=new ThreeShape();c.curves=l.subPath.curves,o.push(c),a.set(l,c);}for(const l of n){if(l.exclude||l.role!=="hole")continue;const c=a.get(l.container);if(!c)continue;const h=new ThreePath();h.curves=l.subPath.curves,c.holes.push(h);}return o;}}class ThreeControls extends ThreeEventDispatcher{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null};}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t;}disconnect(){}dispose(){}update(){}}function dM(r,t){const e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r;}function pM(r,t){const e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r;}function mM(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r;}function Ad(r,t,e,i){const s=gM(i);switch(e){case ThreeAlphaFormat:return r*t;case ThreeRedFormat:return r*t/s.components*s.byteLength;case ThreeRedIntegerFormat:return r*t/s.components*s.byteLength;case ThreeRGFormat:return r*t*2/s.components*s.byteLength;case ThreeRGIntegerFormat:return r*t*2/s.components*s.byteLength;case ThreeRGBFormat:return r*t*3/s.components*s.byteLength;case ThreeRGBAFormat:return r*t*4/s.components*s.byteLength;case ThreeRGBAIntegerFormat:return r*t*4/s.components*s.byteLength;case ThreeRGB_S3TC_DXT1_Format:case ThreeRGBA_S3TC_DXT1_Format:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ThreeRGBA_S3TC_DXT3_Format:case ThreeRGBA_S3TC_DXT5_Format:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case ThreeRGB_PVRTC_2BPPV1_Format:case ThreeRGBA_PVRTC_2BPPV1_Format:return Math.max(r,16)*Math.max(t,8)/4;case ThreeRGB_PVRTC_4BPPV1_Format:case ThreeRGBA_PVRTC_4BPPV1_Format:return Math.max(r,8)*Math.max(t,8)/2;case ThreeRGB_ETC1_Format:case ThreeRGB_ETC2_Format:case ThreeR11_EAC_Format:case ThreeSIGNED_R11_EAC_Format:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ThreeRGBA_ETC2_EAC_Format:case ThreeRG11_EAC_Format:case ThreeSIGNED_RG11_EAC_Format:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case ThreeRGBA_ASTC_4x4_Format:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case ThreeRGBA_ASTC_5x4_Format:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case ThreeRGBA_ASTC_5x5_Format:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case ThreeRGBA_ASTC_6x5_Format:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case ThreeRGBA_ASTC_6x6_Format:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case ThreeRGBA_ASTC_8x5_Format:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case ThreeRGBA_ASTC_8x6_Format:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case ThreeRGBA_ASTC_8x8_Format:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case ThreeRGBA_ASTC_10x5_Format:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case ThreeRGBA_ASTC_10x6_Format:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case ThreeRGBA_ASTC_10x8_Format:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case ThreeRGBA_ASTC_10x10_Format:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case ThreeRGBA_ASTC_12x10_Format:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case ThreeRGBA_ASTC_12x12_Format:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case ThreeRGBA_BPTC_Format:case ThreeRGB_BPTC_SIGNED_Format:case ThreeRGB_BPTC_UNSIGNED_Format:return Math.ceil(r/4)*Math.ceil(t/4)*16;case ThreeRED_RGTC1_Format:case ThreeSIGNED_RED_RGTC1_Format:return Math.ceil(r/4)*Math.ceil(t/4)*8;case ThreeRED_GREEN_RGTC2_Format:case ThreeSIGNED_RED_GREEN_RGTC2_Format:return Math.ceil(r/4)*Math.ceil(t/4)*16;}throw new Error(`Unable to determine texture byte length for ${e} format.`);}function gM(r){switch(r){case ThreeUnsignedByteType:case ThreeByteType:return{byteLength:1,components:1};case ThreeUnsignedShortType:case ThreeShortType:case ThreeHalfFloatType:return{byteLength:2,components:1};case ThreeUnsignedShort4444Type:case ThreeUnsignedShort5551Type:return{byteLength:2,components:4};case ThreeUnsignedIntType:case ThreeIntType:case ThreeFloatType:return{byteLength:4,components:1};case ThreeUnsignedInt5999Type:case ThreeUnsignedInt101111Type:return{byteLength:4,components:3};}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`);}class ThreeTextureUtils{static contain(t,e){return dM(t,e);}static cover(t,e){return pM(t,e);}static fill(t){return mM(t);}static getByteLength(t,e,i,s){return Ad(t,e,i,s);}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ThreeREVISION}}));typeof window<"u"&&(window.__THREE__?Threewarn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ThreeREVISION);function wy(){let r=null,t=!1,e=null,i=null;function s(n,o){i=r.requestAnimationFrame(s),e(n,o);}return{start:function(){t!==!0&&e!==null&&r!==null&&(i=r.requestAnimationFrame(s),t=!0);},stop:function(){r!==null&&r.cancelAnimationFrame(i),t=!1;},setAnimationLoop:function(n){e=n;},setContext:function(n){r=n;}};}function xM(r){const t=new WeakMap();function e(a,l){const c=a.array,h=a.usage,f=c.byteLength,u=r.createBuffer();r.bindBuffer(l,u),r.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=r.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f};}function i(a,l,c){const h=l.array,f=l.updateRanges;if(r.bindBuffer(c,a),f.length===0)r.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){const p=f[u],v=f[d];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++u,f[u]=v);}f.length=u+1;for(let d=0,p=f.length;d<p;d++){const v=f[d];r.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count);}l.clearUpdateRanges();}l.onUploadCallback();}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a);}function n(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(r.deleteBuffer(l.buffer),t.delete(a));}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return;}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version;}}return{get:s,remove:n,update:o};}var yM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`;var wM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`;var _M=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`;var bM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`;var MM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`;var SM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`;var AM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`;var TM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`;var EM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`;var CM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`;var RM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`;var zM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`;var PM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`;var LM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`;var IM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`;var kM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`;var DM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`;var FM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`;var NM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`;var UM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`;var OM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`;var BM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`;var VM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`;var GM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`;var HM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`;var WM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`;var qM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`;var XM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`;var YM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`;var $M=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`;var ZM="gl_FragColor = linearToOutputTexel( gl_FragColor );";var jM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`;var KM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`;var JM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`;var QM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`;var t3=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`;var e3=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`;var i3=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`;var s3=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`;var n3=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`;var o3=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`;var r3=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`;var a3=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`;var l3=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`;var c3=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`;var h3=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`;var u3=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`;var f3=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`;var d3=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`;var p3=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`;var m3=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`;var g3=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`;var v3=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`;var x3=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`;var y3=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`;var w3=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`;var _3=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`;var b3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`;var M3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`;var S3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`;var A3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`;var T3=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`;var E3=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`;var C3=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`;var R3=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`;var z3=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`;var P3=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`;var L3=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`;var I3=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`;var k3=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`;var D3=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`;var F3=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`;var N3=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`;var U3=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`;var O3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`;var B3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`;var V3=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`;var G3=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`;var H3=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`;var W3=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`;var q3=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`;var X3=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`;var Y3=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`;var $3=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`;var Z3=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`;var j3=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`;var K3=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`;var J3=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`;var Q3=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`;var tS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`;var eS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`;var iS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`;var sS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`;var nS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`;var oS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`;var rS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`;var aS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`;var lS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`;var cS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`;var hS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`;var uS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`;var fS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`;var dS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`;var pS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`;var mS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`;var gS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`;var vS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`;var xS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const yS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`;const wS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`;const _S=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`;const bS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`;const MS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`;const SS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`;const AS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`;const TS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`;const ES=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`;const CS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`;const RS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`;const zS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`;const PS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`;const LS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`;const IS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`;const kS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;const DS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`;const FS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;const NS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`;const US=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;const OS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`;const BS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`;const VS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`;const GS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;const HS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`;const WS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;const qS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`;const XS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;const YS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`;const $S=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`;const ZS=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`;const jS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`;const KS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`;const JS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`;const ThreeShaderChunk={alphahash_fragment:yM,alphahash_pars_fragment:wM,alphamap_fragment:_M,alphamap_pars_fragment:bM,alphatest_fragment:MM,alphatest_pars_fragment:SM,aomap_fragment:AM,aomap_pars_fragment:TM,batching_pars_vertex:EM,batching_vertex:CM,begin_vertex:RM,beginnormal_vertex:zM,bsdfs:PM,iridescence_fragment:LM,bumpmap_pars_fragment:IM,clipping_planes_fragment:kM,clipping_planes_pars_fragment:DM,clipping_planes_pars_vertex:FM,clipping_planes_vertex:NM,color_fragment:UM,color_pars_fragment:OM,color_pars_vertex:BM,color_vertex:VM,common:GM,cube_uv_reflection_fragment:HM,defaultnormal_vertex:WM,displacementmap_pars_vertex:qM,displacementmap_vertex:XM,emissivemap_fragment:YM,emissivemap_pars_fragment:$M,colorspace_fragment:ZM,colorspace_pars_fragment:jM,envmap_fragment:KM,envmap_common_pars_fragment:JM,envmap_pars_fragment:QM,envmap_pars_vertex:t3,envmap_physical_pars_fragment:u3,envmap_vertex:e3,fog_vertex:i3,fog_pars_vertex:s3,fog_fragment:n3,fog_pars_fragment:o3,gradientmap_pars_fragment:r3,lightmap_pars_fragment:a3,lights_lambert_fragment:l3,lights_lambert_pars_fragment:c3,lights_pars_begin:h3,lights_toon_fragment:f3,lights_toon_pars_fragment:d3,lights_phong_fragment:p3,lights_phong_pars_fragment:m3,lights_physical_fragment:g3,lights_physical_pars_fragment:v3,lights_fragment_begin:x3,lights_fragment_maps:y3,lights_fragment_end:w3,lightprobes_pars_fragment:_3,logdepthbuf_fragment:b3,logdepthbuf_pars_fragment:M3,logdepthbuf_pars_vertex:S3,logdepthbuf_vertex:A3,map_fragment:T3,map_pars_fragment:E3,map_particle_fragment:C3,map_particle_pars_fragment:R3,metalnessmap_fragment:z3,metalnessmap_pars_fragment:P3,morphinstance_vertex:L3,morphcolor_vertex:I3,morphnormal_vertex:k3,morphtarget_pars_vertex:D3,morphtarget_vertex:F3,normal_fragment_begin:N3,normal_fragment_maps:U3,normal_pars_fragment:O3,normal_pars_vertex:B3,normal_vertex:V3,normalmap_pars_fragment:G3,clearcoat_normal_fragment_begin:H3,clearcoat_normal_fragment_maps:W3,clearcoat_pars_fragment:q3,iridescence_pars_fragment:X3,opaque_fragment:Y3,packing:$3,premultiplied_alpha_fragment:Z3,project_vertex:j3,dithering_fragment:K3,dithering_pars_fragment:J3,roughnessmap_fragment:Q3,roughnessmap_pars_fragment:tS,shadowmap_pars_fragment:eS,shadowmap_pars_vertex:iS,shadowmap_vertex:sS,shadowmask_pars_fragment:nS,skinbase_vertex:oS,skinning_pars_vertex:rS,skinning_vertex:aS,skinnormal_vertex:lS,specularmap_fragment:cS,specularmap_pars_fragment:hS,tonemapping_fragment:uS,tonemapping_pars_fragment:fS,transmission_fragment:dS,transmission_pars_fragment:pS,uv_pars_fragment:mS,uv_pars_vertex:gS,uv_vertex:vS,worldpos_vertex:xS,background_vert:yS,background_frag:wS,backgroundCube_vert:_S,backgroundCube_frag:bS,cube_vert:MS,cube_frag:SS,depth_vert:AS,depth_frag:TS,distance_vert:ES,distance_frag:CS,equirect_vert:RS,equirect_frag:zS,linedashed_vert:PS,linedashed_frag:LS,meshbasic_vert:IS,meshbasic_frag:kS,meshlambert_vert:DS,meshlambert_frag:FS,meshmatcap_vert:NS,meshmatcap_frag:US,meshnormal_vert:OS,meshnormal_frag:BS,meshphong_vert:VS,meshphong_frag:GS,meshphysical_vert:HS,meshphysical_frag:WS,meshtoon_vert:qS,meshtoon_frag:XS,points_vert:YS,points_frag:$S,shadow_vert:ZS,shadow_frag:jS,sprite_vert:KS,sprite_frag:JS};const ThreeUniformsLib={common:{diffuse:{value:new ThreeColor(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ThreeMatrix3()},alphaMap:{value:null},alphaMapTransform:{value:new ThreeMatrix3()},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ThreeMatrix3()}},envmap:{envMap:{value:null},envMapRotation:{value:new ThreeMatrix3()},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ThreeMatrix3()}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ThreeMatrix3()}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ThreeMatrix3()},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ThreeMatrix3()},normalScale:{value:new ThreeVector2(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ThreeMatrix3()},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ThreeMatrix3()}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ThreeMatrix3()}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ThreeMatrix3()}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ThreeColor(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new ThreeVector3()},probesMax:{value:new ThreeVector3()},probesResolution:{value:new ThreeVector3()}},points:{diffuse:{value:new ThreeColor(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ThreeMatrix3()},alphaTest:{value:0},uvTransform:{value:new ThreeMatrix3()}},sprite:{diffuse:{value:new ThreeColor(16777215)},opacity:{value:1},center:{value:new ThreeVector2(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ThreeMatrix3()},alphaMap:{value:null},alphaMapTransform:{value:new ThreeMatrix3()},alphaTest:{value:0}}};const ThreeShaderLib={basic:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.specularmap,ThreeUniformsLib.envmap,ThreeUniformsLib.aomap,ThreeUniformsLib.lightmap,ThreeUniformsLib.fog]),vertexShader:ThreeShaderChunk.meshbasic_vert,fragmentShader:ThreeShaderChunk.meshbasic_frag},lambert:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.specularmap,ThreeUniformsLib.envmap,ThreeUniformsLib.aomap,ThreeUniformsLib.lightmap,ThreeUniformsLib.emissivemap,ThreeUniformsLib.bumpmap,ThreeUniformsLib.normalmap,ThreeUniformsLib.displacementmap,ThreeUniformsLib.fog,ThreeUniformsLib.lights,{emissive:{value:new ThreeColor(0)},envMapIntensity:{value:1}}]),vertexShader:ThreeShaderChunk.meshlambert_vert,fragmentShader:ThreeShaderChunk.meshlambert_frag},phong:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.specularmap,ThreeUniformsLib.envmap,ThreeUniformsLib.aomap,ThreeUniformsLib.lightmap,ThreeUniformsLib.emissivemap,ThreeUniformsLib.bumpmap,ThreeUniformsLib.normalmap,ThreeUniformsLib.displacementmap,ThreeUniformsLib.fog,ThreeUniformsLib.lights,{emissive:{value:new ThreeColor(0)},specular:{value:new ThreeColor(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ThreeShaderChunk.meshphong_vert,fragmentShader:ThreeShaderChunk.meshphong_frag},standard:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.envmap,ThreeUniformsLib.aomap,ThreeUniformsLib.lightmap,ThreeUniformsLib.emissivemap,ThreeUniformsLib.bumpmap,ThreeUniformsLib.normalmap,ThreeUniformsLib.displacementmap,ThreeUniformsLib.roughnessmap,ThreeUniformsLib.metalnessmap,ThreeUniformsLib.fog,ThreeUniformsLib.lights,{emissive:{value:new ThreeColor(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ThreeShaderChunk.meshphysical_vert,fragmentShader:ThreeShaderChunk.meshphysical_frag},toon:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.aomap,ThreeUniformsLib.lightmap,ThreeUniformsLib.emissivemap,ThreeUniformsLib.bumpmap,ThreeUniformsLib.normalmap,ThreeUniformsLib.displacementmap,ThreeUniformsLib.gradientmap,ThreeUniformsLib.fog,ThreeUniformsLib.lights,{emissive:{value:new ThreeColor(0)}}]),vertexShader:ThreeShaderChunk.meshtoon_vert,fragmentShader:ThreeShaderChunk.meshtoon_frag},matcap:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.bumpmap,ThreeUniformsLib.normalmap,ThreeUniformsLib.displacementmap,ThreeUniformsLib.fog,{matcap:{value:null}}]),vertexShader:ThreeShaderChunk.meshmatcap_vert,fragmentShader:ThreeShaderChunk.meshmatcap_frag},points:{uniforms:ns([ThreeUniformsLib.points,ThreeUniformsLib.fog]),vertexShader:ThreeShaderChunk.points_vert,fragmentShader:ThreeShaderChunk.points_frag},dashed:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ThreeShaderChunk.linedashed_vert,fragmentShader:ThreeShaderChunk.linedashed_frag},depth:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.displacementmap]),vertexShader:ThreeShaderChunk.depth_vert,fragmentShader:ThreeShaderChunk.depth_frag},normal:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.bumpmap,ThreeUniformsLib.normalmap,ThreeUniformsLib.displacementmap,{opacity:{value:1}}]),vertexShader:ThreeShaderChunk.meshnormal_vert,fragmentShader:ThreeShaderChunk.meshnormal_frag},sprite:{uniforms:ns([ThreeUniformsLib.sprite,ThreeUniformsLib.fog]),vertexShader:ThreeShaderChunk.sprite_vert,fragmentShader:ThreeShaderChunk.sprite_frag},background:{uniforms:{uvTransform:{value:new ThreeMatrix3()},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ThreeShaderChunk.background_vert,fragmentShader:ThreeShaderChunk.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ThreeMatrix3()}},vertexShader:ThreeShaderChunk.backgroundCube_vert,fragmentShader:ThreeShaderChunk.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ThreeShaderChunk.cube_vert,fragmentShader:ThreeShaderChunk.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ThreeShaderChunk.equirect_vert,fragmentShader:ThreeShaderChunk.equirect_frag},distance:{uniforms:ns([ThreeUniformsLib.common,ThreeUniformsLib.displacementmap,{referencePosition:{value:new ThreeVector3()},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ThreeShaderChunk.distance_vert,fragmentShader:ThreeShaderChunk.distance_frag},shadow:{uniforms:ns([ThreeUniformsLib.lights,ThreeUniformsLib.fog,{color:{value:new ThreeColor(0)},opacity:{value:1}}]),vertexShader:ThreeShaderChunk.shadow_vert,fragmentShader:ThreeShaderChunk.shadow_frag}};ThreeShaderLib.physical={uniforms:ns([ThreeShaderLib.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ThreeMatrix3()},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ThreeMatrix3()},clearcoatNormalScale:{value:new ThreeVector2(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ThreeMatrix3()},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ThreeMatrix3()},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ThreeMatrix3()},sheen:{value:0},sheenColor:{value:new ThreeColor(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ThreeMatrix3()},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ThreeMatrix3()},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ThreeMatrix3()},transmissionSamplerSize:{value:new ThreeVector2()},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ThreeMatrix3()},attenuationDistance:{value:0},attenuationColor:{value:new ThreeColor(0)},specularColor:{value:new ThreeColor(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ThreeMatrix3()},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ThreeMatrix3()},anisotropyVector:{value:new ThreeVector2()},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ThreeMatrix3()}}]),vertexShader:ThreeShaderChunk.meshphysical_vert,fragmentShader:ThreeShaderChunk.meshphysical_frag};const ch={r:0,b:0,g:0};const QS=new ThreeMatrix4();const _y=new ThreeMatrix3();_y.set(-1,0,0,0,1,0,0,0,1);function t5(r,t,e,i,s,n){const o=new ThreeColor(0);let a=s===!0?0:1,l,c,h=null,f=0,u=null;function d(m){let w=m.isScene===!0?m.background:null;if(w&&w.isTexture){const y=m.backgroundBlurriness>0;w=t.get(w,y);}return w;}function p(m){let w=!1;const y=d(m);y===null?g(o,a):y&&y.isColor&&(g(y,1),w=!0);const _=r.xr.getEnvironmentBlendMode();_==="additive"?e.buffers.color.setClear(0,0,0,1,n):_==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,n),(r.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil));}function v(m,w){const y=d(w);y&&(y.isCubeTexture||y.mapping===ThreeCubeUVReflectionMapping)?(c===void 0&&(c=new ThreeMesh(new ThreeBoxGeometry(1,1,1),new ThreeShaderMaterial({name:"BackgroundCubeMaterial",uniforms:Ca(ThreeShaderLib.backgroundCube.uniforms),vertexShader:ThreeShaderLib.backgroundCube.vertexShader,fragmentShader:ThreeShaderLib.backgroundCube.fragmentShader,side:ThreeBackSide,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(_,M,A){this.matrixWorld.copyPosition(A.matrixWorld);},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value;}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(QS.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(_y),c.material.toneMapped=ThreeColorManagement.getTransfer(y.colorSpace)!==ThreeSRGBTransfer,(h!==y||f!==y.version||u!==r.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=r.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ThreeMesh(new ThreePlaneGeometry(2,2),new ThreeShaderMaterial({name:"BackgroundMaterial",uniforms:Ca(ThreeShaderLib.background.uniforms),vertexShader:ThreeShaderLib.background.vertexShader,fragmentShader:ThreeShaderLib.background.fragmentShader,side:ThreeFrontSide,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value;}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ThreeColorManagement.getTransfer(y.colorSpace)!==ThreeSRGBTransfer,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==r.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=r.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null));}function g(m,w){m.getRGB(ch,Xx(r)),e.buffers.color.setClear(ch.r,ch.g,ch.b,w,n);}function x(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0);}return{getClearColor:function(){return o;},setClearColor:function(m,w=1){o.set(m),a=w,g(o,a);},getClearAlpha:function(){return a;},setClearAlpha:function(m){a=m,g(o,a);},render:p,addToRenderList:v,dispose:x};}function e5(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},s=u(null);let n=s,o=!1;function a(T,R,z,L,k){let U=!1;const F=f(T,L,z,R);n!==F&&(n=F,c(n.object)),U=d(T,L,z,k),U&&p(T,L,z,k),k!==null&&t.update(k,r.ELEMENT_ARRAY_BUFFER),(U||o)&&(o=!1,y(T,R,z,L),k!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(k).buffer));}function l(){return r.createVertexArray();}function c(T){return r.bindVertexArray(T);}function h(T){return r.deleteVertexArray(T);}function f(T,R,z,L){const k=L.wireframe===!0;let U=i[R.id];U===void 0&&(U={},i[R.id]=U);const F=T.isInstancedMesh===!0?T.id:0;let G=U[F];G===void 0&&(G={},U[F]=G);let B=G[z.id];B===void 0&&(B={},G[z.id]=B);let q=B[k];return q===void 0&&(q=u(l()),B[k]=q),q;}function u(T){const R=[],z=[],L=[];for(let k=0;k<e;k++)R[k]=0,z[k]=0,L[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:z,attributeDivisors:L,object:T,attributes:{},index:null};}function d(T,R,z,L){const k=n.attributes,U=R.attributes;let F=0;const G=z.getAttributes();for(const B in G)if(G[B].location>=0){const X=k[B];let vt=U[B];if(vt===void 0&&(B==="instanceMatrix"&&T.instanceMatrix&&(vt=T.instanceMatrix),B==="instanceColor"&&T.instanceColor&&(vt=T.instanceColor)),X===void 0||X.attribute!==vt||vt&&X.data!==vt.data)return!0;F++;}return n.attributesNum!==F||n.index!==L;}function p(T,R,z,L){const k={},U=R.attributes;let F=0;const G=z.getAttributes();for(const B in G)if(G[B].location>=0){let X=U[B];X===void 0&&(B==="instanceMatrix"&&T.instanceMatrix&&(X=T.instanceMatrix),B==="instanceColor"&&T.instanceColor&&(X=T.instanceColor));const vt={};vt.attribute=X,X&&X.data&&(vt.data=X.data),k[B]=vt,F++;}n.attributes=k,n.attributesNum=F,n.index=L;}function v(){const T=n.newAttributes;for(let R=0,z=T.length;R<z;R++)T[R]=0;}function g(T){x(T,0);}function x(T,R){const z=n.newAttributes,L=n.enabledAttributes,k=n.attributeDivisors;z[T]=1,L[T]===0&&(r.enableVertexAttribArray(T),L[T]=1),k[T]!==R&&(r.vertexAttribDivisor(T,R),k[T]=R);}function m(){const T=n.newAttributes,R=n.enabledAttributes;for(let z=0,L=R.length;z<L;z++)R[z]!==T[z]&&(r.disableVertexAttribArray(z),R[z]=0);}function w(T,R,z,L,k,U,F){F===!0?r.vertexAttribIPointer(T,R,z,k,U):r.vertexAttribPointer(T,R,z,L,k,U);}function y(T,R,z,L){v();const k=L.attributes,U=z.getAttributes(),F=R.defaultAttributeValues;for(const G in U){const B=U[G];if(B.location>=0){let q=k[G];if(q===void 0&&(G==="instanceMatrix"&&T.instanceMatrix&&(q=T.instanceMatrix),G==="instanceColor"&&T.instanceColor&&(q=T.instanceColor)),q!==void 0){const X=q.normalized,vt=q.itemSize,gt=t.get(q);if(gt===void 0)continue;const Qt=gt.buffer,te=gt.type,Zt=gt.bytesPerElement,J=te===r.INT||te===r.UNSIGNED_INT||q.gpuType===ThreeIntType;if(q.isInterleavedBufferAttribute){const nt=q.data,mt=nt.stride,Y=q.offset;if(nt.isInstancedInterleavedBuffer){for(let xt=0;xt<B.locationSize;xt++)x(B.location+xt,nt.meshPerAttribute);T.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=nt.meshPerAttribute*nt.count);}else for(let xt=0;xt<B.locationSize;xt++)g(B.location+xt);r.bindBuffer(r.ARRAY_BUFFER,Qt);for(let xt=0;xt<B.locationSize;xt++)w(B.location+xt,vt/B.locationSize,te,X,mt*Zt,(Y+vt/B.locationSize*xt)*Zt,J);}else{if(q.isInstancedBufferAttribute){for(let nt=0;nt<B.locationSize;nt++)x(B.location+nt,q.meshPerAttribute);T.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=q.meshPerAttribute*q.count);}else for(let nt=0;nt<B.locationSize;nt++)g(B.location+nt);r.bindBuffer(r.ARRAY_BUFFER,Qt);for(let nt=0;nt<B.locationSize;nt++)w(B.location+nt,vt/B.locationSize,te,X,vt*Zt,vt/B.locationSize*nt*Zt,J);}}else if(F!==void 0){const X=F[G];if(X!==void 0)switch(X.length){case 2:r.vertexAttrib2fv(B.location,X);break;case 3:r.vertexAttrib3fv(B.location,X);break;case 4:r.vertexAttrib4fv(B.location,X);break;default:r.vertexAttrib1fv(B.location,X);}}}}m();}function _(){S();for(const T in i){const R=i[T];for(const z in R){const L=R[z];for(const k in L){const U=L[k];for(const F in U)h(U[F].object),delete U[F];delete L[k];}}delete i[T];}}function M(T){if(i[T.id]===void 0)return;const R=i[T.id];for(const z in R){const L=R[z];for(const k in L){const U=L[k];for(const F in U)h(U[F].object),delete U[F];delete L[k];}}delete i[T.id];}function A(T){for(const R in i){const z=i[R];for(const L in z){const k=z[L];if(k[T.id]===void 0)continue;const U=k[T.id];for(const F in U)h(U[F].object),delete U[F];delete k[T.id];}}}function b(T){for(const R in i){const z=i[R],L=T.isInstancedMesh===!0?T.id:0,k=z[L];if(k!==void 0){for(const U in k){const F=k[U];for(const G in F)h(F[G].object),delete F[G];delete k[U];}delete z[L],Object.keys(z).length===0&&delete i[R];}}}function S(){E(),o=!0,n!==s&&(n=s,c(n.object));}function E(){s.geometry=null,s.program=null,s.wireframe=!1;}return{setup:a,reset:S,resetDefaultState:E,dispose:_,releaseStatesOfGeometry:M,releaseStatesOfObject:b,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:m};}function i5(r,t,e){let i;function s(l){i=l;}function n(l,c){r.drawArrays(i,l,c),e.update(c,i,1);}function o(l,c,h){h!==0&&(r.drawArraysInstanced(i,l,c,h),e.update(c,i,h));}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,i,1);}this.setMode=s,this.render=n,this.renderInstances=o,this.renderMultiDraw=a;}function s5(r,t,e,i){let s;function n(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=r.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT);}else s=0;return s;}function o(A){return!(A!==ThreeRGBAFormat&&i.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT));}function a(A){const b=A===ThreeHalfFloatType&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==ThreeUnsignedByteType&&A!==ThreeFloatType&&!b&&i.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE));}function l(A){if(A==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";A="mediump";}return A==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp";}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Threewarn("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Threewarn("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=r.getParameter(r.MAX_TEXTURE_SIZE),g=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),x=r.getParameter(r.MAX_VERTEX_ATTRIBS),m=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),w=r.getParameter(r.MAX_VARYING_VECTORS),y=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),_=r.getParameter(r.MAX_SAMPLES),M=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:m,maxVaryings:w,maxFragmentUniforms:y,maxSamples:_,samples:M};}function n5(r){const t=this;let e=null,i=0,s=!1,n=!1;const o=new ThreePlane(),a=new ThreeMatrix3(),l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||i!==0||s;return s=u,i=f.length,d;},this.beginShadows=function(){n=!0,h(null);},this.endShadows=function(){n=!1;},this.setGlobalState=function(f,u){e=h(f,u,0);},this.setState=function(f,u,d){const p=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,x=r.get(f);if(!s||p===null||p.length===0||n&&!g)n?h(null):c();else{const m=n?0:i,w=m*4;let y=x.clippingState||null;l.value=y,y=h(p,u,w,d);for(let _=0;_!==w;++_)y[_]=e[_];x.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=m;}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0;}function h(f,u,d,p){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,p!==!0||g===null){const x=d+v*4,m=u.matrixWorldInverse;a.getNormalMatrix(m),(g===null||g.length<x)&&(g=new Float32Array(x));for(let w=0,y=d;w!==v;++w,y+=4)o.copy(f[w]).applyMatrix4(m,a),o.normal.toArray(g,y),g[y+3]=o.constant;}l.value=g,l.needsUpdate=!0;}return t.numPlanes=v,t.numIntersection=0,g;}}const ma=4;const o5=6;const r5=20;const a5=256;const tl=new ThreeOrthographicCamera();const hg=new ThreeColor();let _f=null;let bf=0;let Mf=0;let Sf=!1;const l5=new ThreeVector3();const Jo=new ThreeVector3();class ThreePMREMGenerator{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null;}fromScene(t,e=0,i=.1,s=100,n={}){const{size:o=256,position:a=l5}=n;_f=this._renderer.getRenderTarget(),bf=this._renderer.getActiveCubeFace(),Mf=this._renderer.getActiveMipmapLevel(),Sf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l;}fromEquirectangular(t,e=null){return this._fromTexture(t,e);}fromCubemap(t,e=null){return this._fromTexture(t,e);}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dg(),this._compileMaterial(this._cubemapMaterial));}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fg(),this._compileMaterial(this._equirectMaterial));}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose());}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax);}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose();}_cleanup(t){this._renderer.setRenderTarget(_f,bf,Mf),this._renderer.xr.enabled=Sf,t.scissorTest=!1,ta(t,0,0,t.width,t.height);}_fromTexture(t,e){t.mapping===ThreeCubeReflectionMapping||t.mapping===ThreeCubeRefractionMapping?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),_f=this._renderer.getRenderTarget(),bf=this._renderer.getActiveCubeFace(),Mf=this._renderer.getActiveMipmapLevel(),Sf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i;}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:ThreeLinearFilter,minFilter:ThreeLinearFilter,generateMipmaps:!1,type:ThreeHalfFloatType,format:ThreeRGBAFormat,colorSpace:ThreeLinearSRGBColorSpace,depthBuffer:!1},s=ug(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ug(t,e,i);const{_lodMax:n}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=c5(n)),this._blurMaterial=u5(n,t,e),this._ggxMaterial=h5(n,t,e);}return s;}_compileMaterial(t){const e=new ThreeMesh(new ThreeBufferGeometry(),t);this._renderer.compile(e,tl);}_sceneToCubeUV(t,e,i,s,n){const l=new ThreePerspectiveCamera(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(hg),f.toneMapping=ThreeNoToneMapping,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ThreeMesh(new ThreeBoxGeometry(),new ThreeMeshBasicMaterial({name:"PMREM.Background",side:ThreeBackSide,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,g=v.material;let x=!1;const m=t.background;m?m.isColor&&(g.color.copy(m),t.background=null,x=!0):(g.color.copy(hg),x=!0);for(let w=0;w<6;w++){const y=w%3;y===0?(l.up.set(0,c[w],0),l.position.set(n.x,n.y,n.z),l.lookAt(n.x+h[w],n.y,n.z)):y===1?(l.up.set(0,0,c[w]),l.position.set(n.x,n.y,n.z),l.lookAt(n.x,n.y+h[w],n.z)):(l.up.set(0,c[w],0),l.position.set(n.x,n.y,n.z),l.lookAt(n.x,n.y,n.z+h[w]));const _=this._cubeSize;ta(s,y*_,w>2?_:0,_,_),f.setRenderTarget(s),x&&f.render(v,l),f.render(t,l);}f.toneMapping=d,f.autoClear=u,t.background=m;}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ThreeCubeReflectionMapping||t.mapping===ThreeCubeRefractionMapping;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=dg()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fg());const n=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=n;const a=n.uniforms;a.envMap.value=t;const l=this._cubeSize;ta(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,tl);}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let n=1;n<s;n++)this._applyGGXFilter(t,n-1,n);e.autoClear=i;}_applyGGXFilter(t,e,i){const s=this._renderer,n=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:p}=this,v=this._sizeLods[i],g=3*v*(i>p-ma?i-p+ma:0),x=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=p-e,ta(n,g,x,3*v,2*v),s.setRenderTarget(n),s.render(a,tl),l.envMap.value=n.texture,l.roughness.value=0,l.mipInt.value=p-i,ta(t,g,x,3*v,2*v),s.setRenderTarget(t),s.render(a,tl);}_blur(t,e,i,s){const n=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,n,e,i,o),this._blurPass(n,t,i,i,o);}_blurPass(t,e,i,s,n){const o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;const c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=n,c.mipInt.value=this._lodMax-i;const h=this._sizeLods[s],f=3*h*(s>this._lodMax-ma?s-this._lodMax+ma:0),u=4*(this._cubeSize-h);ta(e,f,u,3*h,2*h),o.setRenderTarget(e),o.render(l,tl);}}function c5(r){const t=[],e=[];let i=r;const s=r-ma+1+o5;for(let n=0;n<s;n++){const o=Math.pow(2,i);t.push(o);const a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,p=new Float32Array(d*u*f),v=new Float32Array(d*u*f);for(let x=0;x<f;x++){const m=x%3*2/3-1,w=x>2?0:-1,y=[m,w,0,m+2/3,w,0,m+2/3,w+1,0,m,w,0,m+2/3,w+1,0,m,w+1,0];p.set(y,d*u*x);for(let _=0;_<u;_++){const M=h[_*2]*2-1,A=h[_*2+1]*2-1;x===0?Jo.set(1,A,M):x===1?Jo.set(-M,1,-A):x===2?Jo.set(-M,A,1):x===3?Jo.set(-1,A,-M):x===4?Jo.set(-M,-1,A):Jo.set(M,A,-1),Jo.toArray(v,(x*u+_)*d);}}const g=new ThreeBufferGeometry();g.setAttribute("position",new ThreeBufferAttribute(p,d)),g.setAttribute("outputDirection",new ThreeBufferAttribute(v,d)),e.push(new ThreeMesh(g,null)),i>ma&&i--;}return{lodMeshes:e,sizeLods:t};}function ug(r,t,e){const i=new ThreeWebGLRenderTarget(r,t,e);return i.texture.mapping=ThreeCubeUVReflectionMapping,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i;}function ta(r,t,e,i,s){r.viewport.set(t,e,i,s),r.scissor.set(t,e,i,s);}function h5(r,t,e){return new ThreeShaderMaterial({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:a5,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Lu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ThreeNoBlending,depthTest:!1,depthWrite:!1});}function u5(r,t,e){return new ThreeShaderMaterial({name:"SphericalGaussianBlur",defines:{SAMPLES:r5,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Lu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:ThreeNoBlending,depthTest:!1,depthWrite:!1});}function fg(){return new ThreeShaderMaterial({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ThreeNoBlending,depthTest:!1,depthWrite:!1});}function dg(){return new ThreeShaderMaterial({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ThreeNoBlending,depthTest:!1,depthWrite:!1});}function Lu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`;}class ThreeWebGLCubeRenderTarget extends ThreeWebGLRenderTarget{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new ThreeCubeTexture(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0;}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ThreeBoxGeometry(5,5,5),n=new ThreeShaderMaterial({name:"CubemapFromEquirect",uniforms:Ca(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ThreeBackSide,blending:ThreeNoBlending});n.uniforms.tEquirect.value=e;const o=new ThreeMesh(s,n),a=e.minFilter;return e.minFilter===ThreeLinearMipmapLinearFilter&&(e.minFilter=ThreeLinearFilter),new ThreeCubeCamera(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this;}clear(t,e=!0,i=!0,s=!0){const n=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(n);}}function f5(r){let t=new WeakMap(),e=new WeakMap(),i=null;function s(u,d=!1){return u==null?null:d?o(u):n(u);}function n(u){if(u&&u.isTexture){const d=u.mapping;if(d===ThreeEquirectangularReflectionMapping||d===ThreeEquirectangularRefractionMapping)if(t.has(u)){const p=t.get(u).texture;return a(p,u.mapping);}else{const p=u.image;if(p&&p.height>0){const v=new ThreeWebGLCubeRenderTarget(p.height);return v.fromEquirectangularTexture(r,u),t.set(u,v),u.addEventListener("dispose",c),a(v.texture,u.mapping);}else return null;}}return u;}function o(u){if(u&&u.isTexture){const d=u.mapping,p=d===ThreeEquirectangularReflectionMapping||d===ThreeEquirectangularRefractionMapping,v=d===ThreeCubeReflectionMapping||d===ThreeCubeRefractionMapping;if(p||v){let g=e.get(u);const x=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==x)return i===null&&(i=new ThreePMREMGenerator(r)),g=p?i.fromEquirectangular(u,g):i.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{const m=u.image;return p&&m&&m.height>0||v&&m&&l(m)?(i===null&&(i=new ThreePMREMGenerator(r)),g=p?i.fromEquirectangular(u):i.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null;}}}return u;}function a(u,d){return d===ThreeEquirectangularReflectionMapping?u.mapping=ThreeCubeReflectionMapping:d===ThreeEquirectangularRefractionMapping&&(u.mapping=ThreeCubeRefractionMapping),u;}function l(u){let d=0;const p=6;for(let v=0;v<p;v++)u[v]!==void 0&&d++;return d===p;}function c(u){const d=u.target;d.removeEventListener("dispose",c);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose());}function h(u){const d=u.target;d.removeEventListener("dispose",h);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose());}function f(){t=new WeakMap(),e=new WeakMap(),i!==null&&(i.dispose(),i=null);}return{get:s,dispose:f};}function d5(r){const t={};function e(i){if(t[i]!==void 0)return t[i];const s=r.getExtension(i);return t[i]=s,s;}return{has:function(i){return e(i)!==null;},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent");},get:function(i){const s=e(i);return s===null&&ThreewarnOnce("WebGLRenderer: "+i+" extension not supported."),s;}};}function p5(r,t,e,i){const s={},n=new WeakMap();function o(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",o),delete s[u.id];const d=n.get(u);d&&(t.remove(d),n.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--;}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u;}function l(f){const u=f.attributes;for(const d in u)t.update(u[d],r.ARRAY_BUFFER);}function c(f){const u=[],d=f.index,p=f.attributes.position;let v=0;if(p===void 0)return;if(d!==null){const m=d.array;v=d.version;for(let w=0,y=m.length;w<y;w+=3){const _=m[w+0],M=m[w+1],A=m[w+2];u.push(_,M,M,A,A,_);}}else{const m=p.array;v=p.version;for(let w=0,y=m.length/3-1;w<y;w+=3){const _=w+0,M=w+1,A=w+2;u.push(_,M,M,A,A,_);}}const g=new(p.count>=65535?ThreeUint32BufferAttribute:ThreeUint16BufferAttribute)(u,1);g.version=v;const x=n.get(f);x&&t.remove(x),n.set(f,g);}function h(f){const u=n.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f);}else c(f);return n.get(f);}return{get:a,update:l,getWireframeAttribute:h};}function m5(r,t,e){let i;function s(f){i=f;}let n,o;function a(f){n=f.type,o=f.bytesPerElement;}function l(f,u){r.drawElements(i,u,n,f*o),e.update(u,i,1);}function c(f,u,d){d!==0&&(r.drawElementsInstanced(i,u,n,f*o,d),e.update(u,i,d));}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,n,f,0,d);let v=0;for(let g=0;g<d;g++)v+=u[g];e.update(v,i,1);}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h;}function g5(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(n,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(n/3);break;case r.LINES:e.lines+=a*(n/2);break;case r.LINE_STRIP:e.lines+=a*(n-1);break;case r.LINE_LOOP:e.lines+=a*n;break;case r.POINTS:e.points+=a*n;break;default:Threeerror("WebGLInfo: Unknown draw mode:",o);break;}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0;}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i};}function v5(r,t,e){const i=new WeakMap(),s=new ThreeVector4();function n(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(a);if(u===void 0||u.count!==f){let E=function(){b.dispose(),i.delete(a),a.removeEventListener("dispose",E);};var d=E;u!==void 0&&u.texture.dispose();const p=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,x=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],w=a.morphAttributes.color||[];let y=0;p===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let _=a.attributes.position.count*y,M=1;_>t.maxTextureSize&&(M=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const A=new Float32Array(_*M*4*f),b=new ThreeDataArrayTexture(A,_,M,f);b.type=ThreeFloatType,b.needsUpdate=!0;const S=y*4;for(let T=0;T<f;T++){const R=x[T],z=m[T],L=w[T],k=_*M*4*T;for(let U=0;U<R.count;U++){const F=U*S;p===!0&&(s.fromBufferAttribute(R,U),A[k+F+0]=s.x,A[k+F+1]=s.y,A[k+F+2]=s.z,A[k+F+3]=0),v===!0&&(s.fromBufferAttribute(z,U),A[k+F+4]=s.x,A[k+F+5]=s.y,A[k+F+6]=s.z,A[k+F+7]=0),g===!0&&(s.fromBufferAttribute(L,U),A[k+F+8]=s.x,A[k+F+9]=s.y,A[k+F+10]=s.z,A[k+F+11]=L.itemSize===4?s.w:1);}}u={count:f,texture:b,size:new ThreeVector2(_,M)},i.set(a,u),a.addEventListener("dispose",E);}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const v=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(r,"morphTargetBaseInfluence",v),l.getUniforms().setValue(r,"morphTargetInfluences",c);}l.getUniforms().setValue(r,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",u.size);}return{update:n};}function x5(r,t,e,i,s){let n=new WeakMap();function o(c){const h=s.render.frame,f=c.geometry,u=t.get(c,f);if(n.get(u)!==h&&(t.update(u),n.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),n.get(c)!==h&&(e.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,r.ARRAY_BUFFER),n.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;n.get(d)!==h&&(d.update(),n.set(d,h));}return u;}function a(){n=new WeakMap();}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor);}return{update:o,dispose:a};}const y5={[ThreeLinearToneMapping]:"LINEAR_TONE_MAPPING",[ThreeReinhardToneMapping]:"REINHARD_TONE_MAPPING",[ThreeCineonToneMapping]:"CINEON_TONE_MAPPING",[ThreeACESFilmicToneMapping]:"ACES_FILMIC_TONE_MAPPING",[ThreeAgXToneMapping]:"AGX_TONE_MAPPING",[ThreeNeutralToneMapping]:"NEUTRAL_TONE_MAPPING",[ThreeCustomToneMapping]:"CUSTOM_TONE_MAPPING"};function w5(r,t,e,i,s,n){const o=new ThreeWebGLRenderTarget(t,e,{type:r,depthBuffer:s,stencilBuffer:n,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let a=null,l=null;const c=new ThreeBufferGeometry();c.setAttribute("position",new ThreeFloat32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ThreeFloat32BufferAttribute([0,2,0,0,2,0],2));const h=new ThreeRawShaderMaterial({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new ThreeMesh(c,h),u=new ThreeOrthographicCamera(-1,1,1,-1,0,1);let d=null,p=null,v=!1,g,x=null,m=[],w=!1;this.setSize=function(y,_){o.setSize(y,_),a!==null&&a.setSize(y,_),l!==null&&l.setSize(y,_);for(let M=0;M<m.length;M++){const A=m[M];A.setSize&&A.setSize(y,_);}},this.setEffects=function(y){m=y,w=m.length>0&&m[0].isRenderPass===!0;const _=o.width,M=o.height;m.length>0&&a===null&&(a=new ThreeWebGLRenderTarget(_,M,{type:ThreeHalfFloatType,depthBuffer:!1,stencilBuffer:!1}),l=new ThreeWebGLRenderTarget(_,M,{type:ThreeHalfFloatType,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<m.length;A++){const b=m[A];b.setSize&&b.setSize(_,M);}},this.begin=function(y,_){if(v||y.toneMapping===ThreeNoToneMapping&&m.length===0)return!1;if(x=_,_!==null){const M=_.width,A=_.height;(o.width!==M||o.height!==A)&&this.setSize(M,A);}return w===!1&&y.setRenderTarget(o),g=y.toneMapping,y.toneMapping=ThreeNoToneMapping,!0;},this.hasRenderPass=function(){return w;},this.end=function(y,_){y.toneMapping=g,v=!0;let M=o,A=a;for(let b=0;b<m.length;b++){const S=m[b];S.enabled!==!1&&(S.render(y,A,M,_),S.needsSwap!==!1&&(M=A,A=A===a?l:a));}if(d!==y.outputColorSpace||p!==y.toneMapping){d=y.outputColorSpace,p=y.toneMapping,h.defines={},ThreeColorManagement.getTransfer(d)===ThreeSRGBTransfer&&(h.defines.SRGB_TRANSFER="");const b=y5[p];b&&(h.defines[b]=""),h.needsUpdate=!0;}h.uniforms.tDiffuse.value=M.texture,y.setRenderTarget(x),y.render(f,u),x=null,v=!1;},this.isCompositing=function(){return v;},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose();};}const by=new ThreeTexture();const Td=new ThreeDepthTexture(1,1);const My=new ThreeDataArrayTexture();const Sy=new ThreeData3DTexture();const Ay=new ThreeCubeTexture();const pg=[];const mg=[];const gg=new Float32Array(16);const vg=new Float32Array(9);const xg=new Float32Array(4);function Ua(r,t,e){const i=r[0];if(i<=0||i>0)return r;const s=t*e;let n=pg[s];if(n===void 0&&(n=new Float32Array(s),pg[s]=n),t!==0){i.toArray(n,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(n,a);}return n;}function zi(r,t){if(r.length!==t.length)return!1;for(let e=0,i=r.length;e<i;e++)if(r[e]!==t[e])return!1;return!0;}function Pi(r,t){for(let e=0,i=t.length;e<i;e++)r[e]=t[e];}function Iu(r,t){let e=mg[t];e===void 0&&(e=new Int32Array(t),mg[t]=e);for(let i=0;i!==t;++i)e[i]=r.allocateTextureUnit();return e;}function _5(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t);}function b5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(zi(e,t))return;r.uniform2fv(this.addr,t),Pi(e,t);}}function M5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(zi(e,t))return;r.uniform3fv(this.addr,t),Pi(e,t);}}function S5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(zi(e,t))return;r.uniform4fv(this.addr,t),Pi(e,t);}}function A5(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(zi(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Pi(e,t);}else{if(zi(e,i))return;xg.set(i),r.uniformMatrix2fv(this.addr,!1,xg),Pi(e,i);}}function T5(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(zi(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Pi(e,t);}else{if(zi(e,i))return;vg.set(i),r.uniformMatrix3fv(this.addr,!1,vg),Pi(e,i);}}function E5(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(zi(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Pi(e,t);}else{if(zi(e,i))return;gg.set(i),r.uniformMatrix4fv(this.addr,!1,gg),Pi(e,i);}}function C5(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t);}function R5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(zi(e,t))return;r.uniform2iv(this.addr,t),Pi(e,t);}}function z5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(zi(e,t))return;r.uniform3iv(this.addr,t),Pi(e,t);}}function P5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(zi(e,t))return;r.uniform4iv(this.addr,t),Pi(e,t);}}function L5(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t);}function I5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(zi(e,t))return;r.uniform2uiv(this.addr,t),Pi(e,t);}}function k5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(zi(e,t))return;r.uniform3uiv(this.addr,t),Pi(e,t);}}function D5(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(zi(e,t))return;r.uniform4uiv(this.addr,t),Pi(e,t);}}function F5(r,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s);let n;this.type===r.SAMPLER_2D_SHADOW?(Td.compareFunction=e.isReversedDepthBuffer()?ThreeGreaterEqualCompare:ThreeLessEqualCompare,n=Td):n=by,e.setTexture2D(t||n,s);}function N5(r,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Sy,s);}function U5(r,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Ay,s);}function O5(r,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||My,s);}function B5(r){switch(r){case 5126:return _5;case 35664:return b5;case 35665:return M5;case 35666:return S5;case 35674:return A5;case 35675:return T5;case 35676:return E5;case 5124:case 35670:return C5;case 35667:case 35671:return R5;case 35668:case 35672:return z5;case 35669:case 35673:return P5;case 5125:return L5;case 36294:return I5;case 36295:return k5;case 36296:return D5;case 35678:case 36198:case 36298:case 36306:case 35682:return F5;case 35679:case 36299:case 36307:return N5;case 35680:case 36300:case 36308:case 36293:return U5;case 36289:case 36303:case 36311:case 36292:return O5;}}function V5(r,t){r.uniform1fv(this.addr,t);}function G5(r,t){const e=Ua(t,this.size,2);r.uniform2fv(this.addr,e);}function H5(r,t){const e=Ua(t,this.size,3);r.uniform3fv(this.addr,e);}function W5(r,t){const e=Ua(t,this.size,4);r.uniform4fv(this.addr,e);}function q5(r,t){const e=Ua(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e);}function X5(r,t){const e=Ua(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e);}function Y5(r,t){const e=Ua(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e);}function $5(r,t){r.uniform1iv(this.addr,t);}function Z5(r,t){r.uniform2iv(this.addr,t);}function j5(r,t){r.uniform3iv(this.addr,t);}function K5(r,t){r.uniform4iv(this.addr,t);}function J5(r,t){r.uniform1uiv(this.addr,t);}function Q5(r,t){r.uniform2uiv(this.addr,t);}function tA(r,t){r.uniform3uiv(this.addr,t);}function eA(r,t){r.uniform4uiv(this.addr,t);}function iA(r,t,e){const i=this.cache,s=t.length,n=Iu(e,s);zi(i,n)||(r.uniform1iv(this.addr,n),Pi(i,n));let o;this.type===r.SAMPLER_2D_SHADOW?o=Td:o=by;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,n[a]);}function sA(r,t,e){const i=this.cache,s=t.length,n=Iu(e,s);zi(i,n)||(r.uniform1iv(this.addr,n),Pi(i,n));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Sy,n[o]);}function nA(r,t,e){const i=this.cache,s=t.length,n=Iu(e,s);zi(i,n)||(r.uniform1iv(this.addr,n),Pi(i,n));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ay,n[o]);}function oA(r,t,e){const i=this.cache,s=t.length,n=Iu(e,s);zi(i,n)||(r.uniform1iv(this.addr,n),Pi(i,n));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||My,n[o]);}function rA(r){switch(r){case 5126:return V5;case 35664:return G5;case 35665:return H5;case 35666:return W5;case 35674:return q5;case 35675:return X5;case 35676:return Y5;case 5124:case 35670:return $5;case 35667:case 35671:return Z5;case 35668:case 35672:return j5;case 35669:case 35673:return K5;case 5125:return J5;case 36294:return Q5;case 36295:return tA;case 36296:return eA;case 35678:case 36198:case 36298:case 36306:case 35682:return iA;case 35679:case 36299:case 36307:return sA;case 35680:case 36300:case 36308:case 36293:return nA;case 36289:case 36303:case 36311:case 36292:return oA;}}class aA{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=B5(e.type);}}class lA{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=rA(e.type);}}class cA{constructor(t){this.id=t,this.seq=[],this.map={};}setValue(t,e,i){const s=this.seq;for(let n=0,o=s.length;n!==o;++n){const a=s[n];a.setValue(t,e[a.id],i);}}}const Af=/(\w+)(\])?(\[|\.)?/g;function yg(r,t){r.seq.push(t),r.map[t.id]=t;}function hA(r,t,e){const i=r.name,s=i.length;for(Af.lastIndex=0;;){const n=Af.exec(i),o=Af.lastIndex;let a=n[1];const l=n[2]==="]",c=n[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){yg(e,c===void 0?new aA(a,r,t):new lA(a,r,t));break;}else{let f=e.map[a];f===void 0&&(f=new cA(a),yg(e,f)),e=f;}}}class Vh{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);hA(a,l,this);}const s=[],n=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):n.push(o);s.length>0&&(this.seq=s.concat(n));}setValue(t,e,i,s){const n=this.map[e];n!==void 0&&n.setValue(t,i,s);}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s);}static upload(t,e,i,s){for(let n=0,o=e.length;n!==o;++n){const a=e[n],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s);}}static seqWithValue(t,e){const i=[];for(let s=0,n=t.length;s!==n;++s){const o=t[s];o.id in e&&i.push(o);}return i;}}function wg(r,t,e){const i=r.createShader(t);return r.shaderSource(i,e),r.compileShader(i),i;}const uA=37297;let fA=0;function dA(r,t){const e=r.split(`
`),i=[],s=Math.max(t-6,0),n=Math.min(t+6,e.length);for(let o=s;o<n;o++){const a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`);}return i.join(`
`);}const _g=new ThreeMatrix3();function pA(r){ThreeColorManagement._getMatrix(_g,ThreeColorManagement.workingColorSpace,r);const t=`mat3( ${_g.elements.map(e=>e.toFixed(4))} )`;switch(ThreeColorManagement.getTransfer(r)){case ThreeLinearTransfer:return[t,"LinearTransferOETF"];case ThreeSRGBTransfer:return[t,"sRGBTransferOETF"];default:return Threewarn("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"];}}function bg(r,t,e){const i=r.getShaderParameter(t,r.COMPILE_STATUS),n=(r.getShaderInfoLog(t)||"").trim();if(i&&n==="")return"";const o=/ERROR: 0:(\d+)/.exec(n);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+n+`

`+dA(r.getShaderSource(t),a);}else return n;}function mA(r,t){const e=pA(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`);}const gA={[ThreeLinearToneMapping]:"Linear",[ThreeReinhardToneMapping]:"Reinhard",[ThreeCineonToneMapping]:"Cineon",[ThreeACESFilmicToneMapping]:"ACESFilmic",[ThreeAgXToneMapping]:"AgX",[ThreeNeutralToneMapping]:"Neutral",[ThreeCustomToneMapping]:"Custom"};function vA(r,t){const e=gA[t];return e===void 0?(Threewarn("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }";}const hh=new ThreeVector3();function xA(){ThreeColorManagement.getLuminanceCoefficients(hh);const r=hh.x.toFixed(4),t=hh.y.toFixed(4),e=hh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`);}function yA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xl).join(`
`);}function wA(r){const t=[];for(const e in r){const i=r[e];i!==!1&&t.push("#define "+e+" "+i);}return t.join(`
`);}function _A(r,t){const e={},i=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const n=r.getActiveAttrib(t,s),o=n.name;let a=1;n.type===r.FLOAT_MAT2&&(a=2),n.type===r.FLOAT_MAT3&&(a=3),n.type===r.FLOAT_MAT4&&(a=4),e[o]={type:n.type,location:r.getAttribLocation(t,o),locationSize:a};}return e;}function xl(r){return r!=="";}function Mg(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows);}function Sg(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection);}const bA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ed(r){return r.replace(bA,SA);}const MA=new Map();function SA(r,t){let e=ThreeShaderChunk[t];if(e===void 0){const i=MA.get(t);if(i!==void 0)e=ThreeShaderChunk[i],Threewarn('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");}return Ed(e);}const AA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ag(r){return r.replace(AA,TA);}function TA(r,t,e,i){let s="";for(let n=parseInt(t);n<parseInt(e);n++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return s;}function Tg(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t;}const EA={[ThreePCFShadowMap]:"SHADOWMAP_TYPE_PCF",[ThreeVSMShadowMap]:"SHADOWMAP_TYPE_VSM"};function CA(r){return EA[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC";}const RA={[ThreeCubeReflectionMapping]:"ENVMAP_TYPE_CUBE",[ThreeCubeRefractionMapping]:"ENVMAP_TYPE_CUBE",[ThreeCubeUVReflectionMapping]:"ENVMAP_TYPE_CUBE_UV"};function zA(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":RA[r.envMapMode]||"ENVMAP_TYPE_CUBE";}const PA={[ThreeCubeRefractionMapping]:"ENVMAP_MODE_REFRACTION"};function LA(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":PA[r.envMapMode]||"ENVMAP_MODE_REFLECTION";}const IA={[ThreeMultiplyOperation]:"ENVMAP_BLENDING_MULTIPLY",[ThreeMixOperation]:"ENVMAP_BLENDING_MIX",[ThreeAddOperation]:"ENVMAP_BLENDING_ADD"};function kA(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":IA[r.combine]||"ENVMAP_BLENDING_NONE";}function DA(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e};}function FA(r,t,e,i){const s=r.getContext(),n=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=CA(e),c=zA(e),h=LA(e),f=kA(e),u=DA(e),d=yA(e),p=wA(n),v=s.createProgram();let g,x,m=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xl).join(`
`),g.length>0&&(g+=`
`),x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xl).join(`
`),x.length>0&&(x+=`
`)):(g=[Tg(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xl).join(`
`),x=[Tg(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ThreeNoToneMapping?"#define TONE_MAPPING":"",e.toneMapping!==ThreeNoToneMapping?ThreeShaderChunk.tonemapping_pars_fragment:"",e.toneMapping!==ThreeNoToneMapping?vA("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ThreeShaderChunk.colorspace_pars_fragment,mA("linearToOutputTexel",e.outputColorSpace),xA(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xl).join(`
`)),o=Ed(o),o=Mg(o,e),o=Sg(o,e),a=Ed(a),a=Mg(a,e),a=Sg(a,e),o=Ag(o),a=Ag(a),e.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,x=["#define varying in",e.glslVersion===ThreeGLSL3?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ThreeGLSL3?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const w=m+g+o,y=m+x+a,_=wg(s,s.VERTEX_SHADER,w),M=wg(s,s.FRAGMENT_SHADER,y);s.attachShader(v,_),s.attachShader(v,M),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(T){if(r.debug.checkShaderErrors){const R=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(_)||"",L=s.getShaderInfoLog(M)||"",k=R.trim(),U=z.trim(),F=L.trim();let G=!0,B=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1){if(G=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(s,v,_,M);else{const q=bg(s,_,"vertex"),X=bg(s,M,"fragment");Threeerror("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+k+`
`+q+`
`+X);}}else k!==""?Threewarn("WebGLProgram: Program Info Log:",k):(U===""||F==="")&&(B=!1);B&&(T.diagnostics={runnable:G,programLog:k,vertexShader:{log:U,prefix:g},fragmentShader:{log:F,prefix:x}});}s.deleteShader(_),s.deleteShader(M),b=new Vh(s,v),S=_A(s,v);}let b;this.getUniforms=function(){return b===void 0&&A(this),b;};let S;this.getAttributes=function(){return S===void 0&&A(this),S;};let E=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=s.getProgramParameter(v,uA)),E;},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0;},this.type=e.shaderType,this.name=e.shaderName,this.id=fA++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=_,this.fragmentShader=M,this;}let NA=0;class UA{constructor(){this.shaderCache=new Map(),this.materialCache=new Map();}update(t,e,i){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this;}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this;}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader);}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader);}dispose(){this.shaderCache.clear(),this.materialCache.clear();}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set(),e.set(t,i)),i;}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new OA(t),e.set(t,i)),i;}}class OA{constructor(t){this.id=NA++,this.code=t,this.usedTimes=0;}}function BA(r){return r===ThreeRGFormat||r===ThreeRG11_EAC_Format||r===ThreeRED_GREEN_RGTC2_Format;}function VA(r,t,e,i,s,n){const o=new ThreeLayers(),a=new UA(),l=new Set(),c=[],h=new Map(),f=i.logarithmicDepthBuffer;let u=i.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(b){return l.add(b),b===0?"uv":`uv${b}`;}function v(b,S,E,T,R,z){const L=T.fog,k=R.geometry,U=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?T.environment:null,F=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap,G=t.get(b.envMap||U,F),B=G&&G.mapping===ThreeCubeUVReflectionMapping?G.image.height:null,q=d[b.type];b.precision!==null&&(u=i.getMaxPrecision(b.precision),u!==b.precision&&Threewarn("WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const X=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,vt=X!==void 0?X.length:0;let gt=0;k.morphAttributes.position!==void 0&&(gt=1),k.morphAttributes.normal!==void 0&&(gt=2),k.morphAttributes.color!==void 0&&(gt=3);let Qt,te,Zt,J;if(q){const je=ThreeShaderLib[q];Qt=je.vertexShader,te=je.fragmentShader;}else{Qt=b.vertexShader,te=b.fragmentShader;const je=a.getVertexShaderStage(b),Oe=a.getFragmentShaderStage(b);a.update(b,je,Oe),Zt=je.id,J=Oe.id;}const nt=r.getRenderTarget(),mt=r.state.buffers.depth.getReversed(),Y=R.isInstancedMesh===!0,xt=R.isBatchedMesh===!0,yt=!!b.map,fe=!!b.matcap,et=!!G,ut=!!b.aoMap,dt=!!b.lightMap,ft=!!b.bumpMap&&b.wireframe===!1,wt=!!b.normalMap,Wt=!!b.displacementMap,Ht=!!b.emissiveMap,qt=!!b.metalnessMap,ce=!!b.roughnessMap,O=b.anisotropy>0,Ae=b.clearcoat>0,de=b.dispersion>0,D=b.retroreflectivity>0,P=b.iridescence>0,W=b.sheen>0,Z=b.transmission>0,st=O&&!!b.anisotropyMap,_t=Ae&&!!b.clearcoatMap,bt=Ae&&!!b.clearcoatNormalMap,ot=Ae&&!!b.clearcoatRoughnessMap,lt=P&&!!b.iridescenceMap,Tt=P&&!!b.iridescenceThicknessMap,ne=W&&!!b.sheenColorMap,Dt=W&&!!b.sheenRoughnessMap,Et=!!b.specularMap,oe=!!b.specularColorMap,ue=!!b.specularIntensityMap,we=Z&&!!b.transmissionMap,H=Z&&!!b.thicknessMap,Ct=!!b.gradientMap,ct=!!b.alphaMap,Rt=b.alphaTest>0,Ot=!!b.alphaHash,pt=!!b.extensions;let re=ThreeNoToneMapping;b.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(re=r.toneMapping);const ee={shaderID:q,shaderType:b.type,shaderName:b.name,vertexShader:Qt,fragmentShader:te,defines:b.defines,customVertexShaderID:Zt,customFragmentShaderID:J,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:xt,batchingColor:xt&&R._colorsTexture!==null,instancing:Y,instancingColor:Y&&R.instanceColor!==null,instancingMorph:Y&&R.morphTexture!==null,outputColorSpace:nt===null?r.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:ThreeColorManagement.workingColorSpace,alphaToCoverage:!!b.alphaToCoverage,map:yt,matcap:fe,envMap:et,envMapMode:et&&G.mapping,envMapCubeUVHeight:B,aoMap:ut,lightMap:dt,bumpMap:ft,normalMap:wt,displacementMap:Wt,emissiveMap:Ht,normalMapObjectSpace:wt&&b.normalMapType===ThreeObjectSpaceNormalMap,normalMapTangentSpace:wt&&b.normalMapType===ThreeTangentSpaceNormalMap,packedNormalMap:wt&&b.normalMapType===ThreeTangentSpaceNormalMap&&BA(b.normalMap.format),metalnessMap:qt,roughnessMap:ce,anisotropy:O,anisotropyMap:st,clearcoat:Ae,clearcoatMap:_t,clearcoatNormalMap:bt,clearcoatRoughnessMap:ot,dispersion:de,retroreflection:D,iridescence:P,iridescenceMap:lt,iridescenceThicknessMap:Tt,sheen:W,sheenColorMap:ne,sheenRoughnessMap:Dt,specularMap:Et,specularColorMap:oe,specularIntensityMap:ue,transmission:Z,transmissionMap:we,thicknessMap:H,gradientMap:Ct,opaque:b.transparent===!1&&b.blending===ThreeNormalBlending&&b.alphaToCoverage===!1,alphaMap:ct,alphaTest:Rt,alphaHash:Ot,combine:b.combine,mapUv:yt&&p(b.map.channel),aoMapUv:ut&&p(b.aoMap.channel),lightMapUv:dt&&p(b.lightMap.channel),bumpMapUv:ft&&p(b.bumpMap.channel),normalMapUv:wt&&p(b.normalMap.channel),displacementMapUv:Wt&&p(b.displacementMap.channel),emissiveMapUv:Ht&&p(b.emissiveMap.channel),metalnessMapUv:qt&&p(b.metalnessMap.channel),roughnessMapUv:ce&&p(b.roughnessMap.channel),anisotropyMapUv:st&&p(b.anisotropyMap.channel),clearcoatMapUv:_t&&p(b.clearcoatMap.channel),clearcoatNormalMapUv:bt&&p(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&p(b.clearcoatRoughnessMap.channel),iridescenceMapUv:lt&&p(b.iridescenceMap.channel),iridescenceThicknessMapUv:Tt&&p(b.iridescenceThicknessMap.channel),sheenColorMapUv:ne&&p(b.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&p(b.sheenRoughnessMap.channel),specularMapUv:Et&&p(b.specularMap.channel),specularColorMapUv:oe&&p(b.specularColorMap.channel),specularIntensityMapUv:ue&&p(b.specularIntensityMap.channel),transmissionMapUv:we&&p(b.transmissionMap.channel),thicknessMapUv:H&&p(b.thicknessMap.channel),alphaMapUv:ct&&p(b.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(wt||O),vertexNormals:!!k.attributes.normal,vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!k.attributes.uv&&(yt||ct),fog:!!L,useFog:b.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:b.wireframe===!1&&(b.flatShading===!0||k.attributes.normal===void 0&&wt===!1&&(b.isMeshLambertMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isMeshPhysicalMaterial)),sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:mt,skinning:R.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:vt,morphTextureStride:gt,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:n.numPlanes,numClipIntersection:n.numIntersection,dithering:b.dithering,shadowMapEnabled:r.shadowMap.enabled&&E.length>0,shadowMapType:r.shadowMap.type,toneMapping:re,decodeVideoTexture:yt&&b.map.isVideoTexture===!0&&ThreeColorManagement.getTransfer(b.map.colorSpace)===ThreeSRGBTransfer,decodeVideoTextureEmissive:Ht&&b.emissiveMap.isVideoTexture===!0&&ThreeColorManagement.getTransfer(b.emissiveMap.colorSpace)===ThreeSRGBTransfer,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ThreeDoubleSide,flipSided:b.side===ThreeBackSide,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:pt&&b.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pt&&b.extensions.multiDraw===!0||xt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ee.vertexUv1s=l.has(1),ee.vertexUv2s=l.has(2),ee.vertexUv3s=l.has(3),l.clear(),ee;}function g(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const E in b.defines)S.push(E),S.push(b.defines[E]);return b.isRawShaderMaterial===!1&&(x(S,b),m(S,b),S.push(r.outputColorSpace)),S.push(b.customProgramCacheKey),S.join();}function x(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numSunLights),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numSunLightShadows),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking);}function m(b,S){o.disableAll(),S.instancing&&o.enable(0),S.instancingColor&&o.enable(1),S.instancingMorph&&o.enable(2),S.matcap&&o.enable(3),S.envMap&&o.enable(4),S.normalMapObjectSpace&&o.enable(5),S.normalMapTangentSpace&&o.enable(6),S.clearcoat&&o.enable(7),S.iridescence&&o.enable(8),S.alphaTest&&o.enable(9),S.vertexColors&&o.enable(10),S.vertexAlphas&&o.enable(11),S.vertexUv1s&&o.enable(12),S.vertexUv2s&&o.enable(13),S.vertexUv3s&&o.enable(14),S.vertexTangents&&o.enable(15),S.anisotropy&&o.enable(16),S.alphaHash&&o.enable(17),S.batching&&o.enable(18),S.dispersion&&o.enable(19),S.retroreflection&&o.enable(24),S.batchingColor&&o.enable(20),S.gradientMap&&o.enable(21),S.packedNormalMap&&o.enable(22),S.vertexNormals&&o.enable(23),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),S.numLightProbeGrids>0&&o.enable(22),S.hasPositionAttribute&&o.enable(23),b.push(o.mask);}function w(b){const S=d[b.type];let E;if(S){const T=ThreeShaderLib[S];E=ThreeUniformsUtils.clone(T.uniforms);}else E=b.uniforms;return E;}function y(b,S){let E=h.get(S);return E!==void 0?++E.usedTimes:(E=new FA(r,S,b,s),c.push(E),h.set(S,E)),E;}function _(b){if(--b.usedTimes===0){const S=c.indexOf(b);c[S]=c[c.length-1],c.pop(),h.delete(b.cacheKey),b.destroy();}}function M(b){a.remove(b);}function A(){a.dispose();}return{getParameters:v,getProgramCacheKey:g,getUniforms:w,acquireProgram:y,releaseProgram:_,releaseShaderCache:M,programs:c,dispose:A};}function GA(){let r=new WeakMap();function t(o){return r.has(o);}function e(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a;}function i(o){r.delete(o);}function s(o,a,l){r.get(o)[a]=l;}function n(){r=new WeakMap();}return{has:t,get:e,remove:i,update:s,dispose:n};}function HA(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.materialVariant!==t.materialVariant?r.materialVariant-t.materialVariant:r.z!==t.z?r.z-t.z:r.id-t.id;}function Eg(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id;}function Cg(){const r=[];let t=0;const e=[],i=[],s=[];function n(){t=0,e.length=0,i.length=0,s.length=0;}function o(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d;}function a(u,d,p,v,g,x){let m=r[t];return m===void 0?(m={id:u.id,object:u,geometry:d,material:p,materialVariant:o(u),groupOrder:v,renderOrder:u.renderOrder,z:g,group:x},r[t]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=p,m.materialVariant=o(u),m.groupOrder=v,m.renderOrder=u.renderOrder,m.z=g,m.group=x),t++,m;}function l(u,d,p,v,g,x,m){m.reversedDepth===!0&&(g=-g);const w=a(u,d,p,v,g,x);p.transmission>0?i.push(w):p.transparent===!0?s.push(w):e.push(w);}function c(u,d,p,v,g,x){const m=a(u,d,p,v,g,x);p.transmission>0?i.unshift(m):p.transparent===!0?s.unshift(m):e.unshift(m);}function h(u,d){e.length>1&&e.sort(u||HA),i.length>1&&i.sort(d||Eg),s.length>1&&s.sort(d||Eg);}function f(){for(let u=t,d=r.length;u<d;u++){const p=r[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null;}}return{opaque:e,transmissive:i,transparent:s,init:n,push:l,unshift:c,finish:f,sort:h};}function WA(){let r=new WeakMap();function t(i,s){const n=r.get(i);let o;return n===void 0?(o=new Cg(),r.set(i,[o])):s>=n.length?(o=new Cg(),n.push(o)):o=n[s],o;}function e(){r=new WeakMap();}return{get:t,dispose:e};}function qA(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new ThreeVector3(),color:new ThreeColor()};break;case"SpotLight":e={position:new ThreeVector3(),direction:new ThreeVector3(),color:new ThreeColor(),distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new ThreeVector3(),color:new ThreeColor(),distance:0,decay:0};break;case"HemisphereLight":e={direction:new ThreeVector3(),skyColor:new ThreeColor(),groundColor:new ThreeColor()};break;case"RectAreaLight":e={color:new ThreeColor(),position:new ThreeVector3(),halfWidth:new ThreeVector3(),halfHeight:new ThreeVector3()};break;}return r[t.id]=e,e;}};}function XA(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ThreeVector2()};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ThreeVector2()};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ThreeVector2(),shadowCameraNear:1,shadowCameraFar:1e3};break;}return r[t.id]=e,e;}};}let YA=0;function $A(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0);}function ZA(r){const t=new qA(),e=XA(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new ThreeVector3());const s=new ThreeVector3(),n=new ThreeMatrix4(),o=new ThreeMatrix4();function a(c){let h=0,f=0,u=0;for(let R=0;R<9;R++)i.probe[R].set(0,0,0);let d=0,p=0,v=0,g=0,x=0,m=0,w=0,y=0,_=0,M=0,A=0,b=0,S=0,E=0;c.sort($A);for(let R=0,z=c.length;R<z;R++){const L=c[R],k=L.color,U=L.intensity,F=L.distance;let G=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===ThreeRGFormat?G=L.shadow.map.texture:G=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=k.r*U,f+=k.g*U,u+=k.b*U;else if(L.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(L.sh.coefficients[B],U);E++;}else if(L.isSunLight){const B=t.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const q=L.shadow,X=e.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),i.sunShadow[p]=X,i.sunShadowMap[p]=G;const vt=q.getViewportCount();for(let gt=0;gt<vt;gt++)i.sunShadowMatrix[v+gt]=q.getMatrix(gt),i.sunShadowCascade[v+gt]=q._cascadeData[gt];v+=vt,p++;}i.sun[d]=B,d++;}else if(L.isDirectionalLight){const B=t.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const q=L.shadow,X=e.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,i.directionalShadow[g]=X,i.directionalShadowMap[g]=G,i.directionalShadowMatrix[g]=L.shadow.matrix,_++;}i.directional[g]=B,g++;}else if(L.isSpotLight){const B=t.get(L);B.position.setFromMatrixPosition(L.matrixWorld),B.color.copy(k).multiplyScalar(U),B.distance=F,B.coneCos=Math.cos(L.angle),B.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),B.decay=L.decay,i.spot[m]=B;const q=L.shadow;if(L.map&&(i.spotLightMap[b]=L.map,b++,q.updateMatrices(L),L.castShadow&&S++),i.spotLightMatrix[m]=q.matrix,L.castShadow){const X=e.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,i.spotShadow[m]=X,i.spotShadowMap[m]=G,A++;}m++;}else if(L.isRectAreaLight){const B=t.get(L);B.color.copy(k).multiplyScalar(U),B.halfWidth.set(L.width*.5,0,0),B.halfHeight.set(0,L.height*.5,0),i.rectArea[w]=B,w++;}else if(L.isPointLight){const B=t.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),B.distance=L.distance,B.decay=L.decay,L.castShadow){const q=L.shadow,X=e.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,X.shadowCameraNear=q.camera.near,X.shadowCameraFar=q.camera.far,i.pointShadow[x]=X,i.pointShadowMap[x]=G,i.pointShadowMatrix[x]=L.shadow.matrix,M++;}i.point[x]=B,x++;}else if(L.isHemisphereLight){const B=t.get(L);B.skyColor.copy(L.color).multiplyScalar(U),B.groundColor.copy(L.groundColor).multiplyScalar(U),i.hemi[y]=B,y++;}}w>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ThreeUniformsLib.LTC_FLOAT_1,i.rectAreaLTC2=ThreeUniformsLib.LTC_FLOAT_2):(i.rectAreaLTC1=ThreeUniformsLib.LTC_HALF_1,i.rectAreaLTC2=ThreeUniformsLib.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const T=i.hash;(T.sunLength!==d||T.directionalLength!==g||T.pointLength!==x||T.spotLength!==m||T.rectAreaLength!==w||T.hemiLength!==y||T.numSunShadows!==p||T.numDirectionalShadows!==_||T.numPointShadows!==M||T.numSpotShadows!==A||T.numSpotMaps!==b||T.numLightProbes!==E)&&(i.sun.length=d,i.directional.length=g,i.spot.length=m,i.rectArea.length=w,i.point.length=x,i.hemi.length=y,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=v,i.sunShadowCascade.length=v,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.directionalShadowMatrix.length=_,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=A,i.spotShadowMap.length=A,i.spotLightMatrix.length=A+b-S,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,T.sunLength=d,T.directionalLength=g,T.pointLength=x,T.spotLength=m,T.rectAreaLength=w,T.hemiLength=y,T.numSunShadows=p,T.numDirectionalShadows=_,T.numPointShadows=M,T.numSpotShadows=A,T.numSpotMaps=b,T.numLightProbes=E,i.version=YA++);}function l(c,h){let f=0,u=0,d=0,p=0,v=0,g=0;const x=h.matrixWorldInverse;for(let m=0,w=c.length;m<w;m++){const y=c[m];if(y.isSunLight){const _=i.sun[f];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(x),f++;}else if(y.isDirectionalLight){const _=i.directional[u];_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(x),u++;}else if(y.isSpotLight){const _=i.spot[p];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(x),_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(x),p++;}else if(y.isRectAreaLight){const _=i.rectArea[v];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(x),o.identity(),n.copy(y.matrixWorld),n.premultiply(x),o.extractRotation(n),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),v++;}else if(y.isPointLight){const _=i.point[d];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(x),d++;}else if(y.isHemisphereLight){const _=i.hemi[g];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(x),g++;}}}return{setup:a,setupView:l,state:i};}function Rg(r){const t=new ZA(r),e=[],i=[],s=[];function n(u){f.camera=u,e.length=0,i.length=0,s.length=0;}function o(u){e.push(u);}function a(u){i.push(u);}function l(u){s.push(u);}function c(){t.setup(e);}function h(u){t.setupView(e,u);}const f={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:n,state:f,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l};}function jA(r){let t=new WeakMap();function e(s,n=0){const o=t.get(s);let a;return o===void 0?(a=new Rg(r),t.set(s,[a])):n>=o.length?(a=new Rg(r),o.push(a)):a=o[n],a;}function i(){t=new WeakMap();}return{get:e,dispose:i};}const KA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`;const JA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`;const QA=[new ThreeVector3(1,0,0),new ThreeVector3(-1,0,0),new ThreeVector3(0,1,0),new ThreeVector3(0,-1,0),new ThreeVector3(0,0,1),new ThreeVector3(0,0,-1)];const tT=[new ThreeVector3(0,-1,0),new ThreeVector3(0,-1,0),new ThreeVector3(0,0,1),new ThreeVector3(0,0,-1),new ThreeVector3(0,-1,0),new ThreeVector3(0,-1,0)];const zg=new ThreeMatrix4();const el=new ThreeVector3();const Tf=new ThreeVector3();function eT(r,t,e){let i=new ThreeFrustum();const s=new ThreeVector2(),n=new ThreeVector2(),o=new ThreeVector4(),a=new ThreeMeshDepthMaterial(),l=new ThreeMeshDistanceMaterial(),c={},h=e.maxTextureSize,f={[ThreeFrontSide]:ThreeBackSide,[ThreeBackSide]:ThreeFrontSide,[ThreeDoubleSide]:ThreeDoubleSide},u=new ThreeShaderMaterial({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ThreeVector2()},radius:{value:4}},vertexShader:KA,fragmentShader:JA}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const p=new ThreeBufferGeometry();p.setAttribute("position",new ThreeBufferAttribute(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ThreeMesh(p,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ThreePCFShadowMap;let x=this.type;this.render=function(M,A,b){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;this.type===ThreePCFSoftShadowMap&&(Threewarn("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ThreePCFShadowMap);const S=r.getRenderTarget(),E=r.getActiveCubeFace(),T=r.getActiveMipmapLevel(),R=r.state;R.setBlending(ThreeNoBlending),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const z=x!==this.type;z&&A.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(k=>k.needsUpdate=!0):L.material.needsUpdate=!0);});for(let L=0,k=M.length;L<k;L++){const U=M[L],F=U.shadow;if(F===void 0){Threewarn("WebGLShadowMap:",U,"has no shadow.");continue;}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);const G=F.getFrameExtents();s.multiply(G),n.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(n.x=Math.floor(h/G.x),s.x=n.x*G.x,F.mapSize.x=n.x),s.y>h&&(n.y=Math.floor(h/G.y),s.y=n.y*G.y,F.mapSize.y=n.y));const B=r.state.buffers.depth.getReversed();if(F.camera._reversedDepth=B,F.map===null||z===!0){if(F.map!==null&&(F.map.depthTexture!==null&&(F.map.depthTexture.dispose(),F.map.depthTexture=null),F.map.dispose()),this.type===ThreeVSMShadowMap){if(U.isPointLight){Threewarn("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue;}F.map=new ThreeWebGLRenderTarget(s.x,s.y,{format:ThreeRGFormat,type:ThreeHalfFloatType,minFilter:ThreeLinearFilter,magFilter:ThreeLinearFilter,generateMipmaps:!1}),F.map.texture.name=U.name+".shadowMap",F.map.depthTexture=new ThreeDepthTexture(s.x,s.y,ThreeFloatType),F.map.depthTexture.name=U.name+".shadowMapDepth",F.map.depthTexture.format=ThreeDepthFormat,F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=ThreeNearestFilter,F.map.depthTexture.magFilter=ThreeNearestFilter;}else U.isPointLight?(F.map=new ThreeWebGLCubeRenderTarget(s.x),F.map.depthTexture=new ThreeCubeDepthTexture(s.x,ThreeUnsignedIntType)):(F.map=new ThreeWebGLRenderTarget(s.x,s.y),F.map.depthTexture=new ThreeDepthTexture(s.x,s.y,ThreeUnsignedIntType)),F.map.depthTexture.name=U.name+".shadowMap",F.map.depthTexture.format=ThreeDepthFormat,this.type===ThreePCFShadowMap?(F.map.depthTexture.compareFunction=B?ThreeGreaterEqualCompare:ThreeLessEqualCompare,F.map.depthTexture.minFilter=ThreeLinearFilter,F.map.depthTexture.magFilter=ThreeLinearFilter):(F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=ThreeNearestFilter,F.map.depthTexture.magFilter=ThreeNearestFilter);F.camera.updateProjectionMatrix();}F.map.isWebGLCubeRenderTarget!==!0&&(F.map.width!==s.x||F.map.height!==s.y)&&F.map.setSize(s.x,s.y);const q=F.map.isWebGLCubeRenderTarget?6:F.getViewportCount();U.isPointLight!==!0&&F.updateMatrices(U,b);for(let X=0;X<q;X++){const vt=F.getCamera(X);if(U.isPointLight){const gt=F.camera,Qt=F.matrix,te=U.distance||gt.far;te!==gt.far&&(gt.far=te,gt.updateProjectionMatrix()),el.setFromMatrixPosition(U.matrixWorld),gt.position.copy(el),Tf.copy(gt.position),Tf.add(QA[X]),gt.up.copy(tT[X]),gt.lookAt(Tf),gt.updateMatrixWorld(),Qt.makeTranslation(-el.x,-el.y,-el.z),zg.multiplyMatrices(gt.projectionMatrix,gt.matrixWorldInverse),F._frustum.setFromProjectionMatrix(zg,gt.coordinateSystem,gt.reversedDepth);}if(F.map.isWebGLCubeRenderTarget)r.setRenderTarget(F.map,X),r.clear();else{X===0&&(r.setRenderTarget(F.map),r.clear());const gt=F.getViewport(X);o.set(n.x*gt.x,n.y*gt.y,n.x*gt.z,n.y*gt.w),R.viewport(o);}i=F.getFrustum(X),y(A,b,vt,U,this.type);}F.isPointLightShadow!==!0&&this.type===ThreeVSMShadowMap&&m(F,b),F.needsUpdate=!1;}x=this.type,g.needsUpdate=!1,r.setRenderTarget(S,E,T);};function m(M,A){const b=t.update(v);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null?M.mapPass=new ThreeWebGLRenderTarget(s.x,s.y,{format:ThreeRGFormat,type:ThreeHalfFloatType}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,r.setRenderTarget(M.mapPass),r.clear(),r.renderBufferDirect(A,null,b,u,v,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,r.setRenderTarget(M.map),r.clear(),r.renderBufferDirect(A,null,b,d,v,null);}function w(M,A,b,S){let E=null;const T=b.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(T!==void 0)E=T;else if(E=b.isPointLight===!0?l:a,r.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const R=E.uuid,z=A.uuid;let L=c[R];L===void 0&&(L={},c[R]=L);let k=L[z];k===void 0&&(k=E.clone(),L[z]=k,A.addEventListener("dispose",_)),E=k;}if(E.visible=A.visible,E.wireframe=A.wireframe,S===ThreeVSMShadowMap?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:f[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,b.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const R=r.properties.get(E);R.light=b;}return E;}function y(M,A,b,S,E){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&E===ThreeVSMShadowMap)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,M.matrixWorld);const z=t.update(M),L=M.material;if(Array.isArray(L)){const k=z.groups;for(let U=0,F=k.length;U<F;U++){const G=k[U],B=L[G.materialIndex];if(B&&B.visible){const q=w(M,B,S,E);M.onBeforeShadow(r,M,A,b,z,q,G),r.renderBufferDirect(b,null,z,q,M,G),M.onAfterShadow(r,M,A,b,z,q,G);}}}else if(L.visible){const k=w(M,L,S,E);M.onBeforeShadow(r,M,A,b,z,k,null),r.renderBufferDirect(b,null,z,k,M,null),M.onAfterShadow(r,M,A,b,z,k,null);}}const R=M.children;for(let z=0,L=R.length;z<L;z++)y(R[z],A,b,S,E);}function _(M){M.target.removeEventListener("dispose",_);for(const b in c){const S=c[b],E=M.target.uuid;E in S&&(S[E].dispose(),delete S[E]);}}}function iT(r,t){function e(){let H=!1;const Ct=new ThreeVector4();let ct=null;const Rt=new ThreeVector4(0,0,0,0);return{setMask:function(Ot){ct!==Ot&&!H&&(r.colorMask(Ot,Ot,Ot,Ot),ct=Ot);},setLocked:function(Ot){H=Ot;},setClear:function(Ot,pt,re,ee,je){je===!0&&(Ot*=ee,pt*=ee,re*=ee),Ct.set(Ot,pt,re,ee),Rt.equals(Ct)===!1&&(r.clearColor(Ot,pt,re,ee),Rt.copy(Ct));},reset:function(){H=!1,ct=null,Rt.set(-1,0,0,0);}};}function i(){let H=!1,Ct=!1,ct=null,Rt=null,Ot=null;return{setReversed:function(pt){if(Ct!==pt){const re=t.get("EXT_clip_control");pt?re.clipControlEXT(re.LOWER_LEFT_EXT,re.ZERO_TO_ONE_EXT):re.clipControlEXT(re.LOWER_LEFT_EXT,re.NEGATIVE_ONE_TO_ONE_EXT),Ct=pt;const ee=Ot;Ot=null,this.setClear(ee);}},getReversed:function(){return Ct;},setTest:function(pt){pt?nt(r.DEPTH_TEST):mt(r.DEPTH_TEST);},setMask:function(pt){ct!==pt&&!H&&(r.depthMask(pt),ct=pt);},setFunc:function(pt){if(Ct&&(pt=v_[pt]),Rt!==pt){switch(pt){case ThreeNeverDepth:r.depthFunc(r.NEVER);break;case ThreeAlwaysDepth:r.depthFunc(r.ALWAYS);break;case ThreeLessDepth:r.depthFunc(r.LESS);break;case ThreeLessEqualDepth:r.depthFunc(r.LEQUAL);break;case ThreeEqualDepth:r.depthFunc(r.EQUAL);break;case ThreeGreaterEqualDepth:r.depthFunc(r.GEQUAL);break;case ThreeGreaterDepth:r.depthFunc(r.GREATER);break;case ThreeNotEqualDepth:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL);}Rt=pt;}},setLocked:function(pt){H=pt;},setClear:function(pt){Ot!==pt&&(Ot=pt,Ct&&(pt=1-pt),r.clearDepth(pt));},reset:function(){H=!1,ct=null,Rt=null,Ot=null,Ct=!1;}};}function s(){let H=!1,Ct=null,ct=null,Rt=null,Ot=null,pt=null,re=null,ee=null,je=null;return{setTest:function(Oe){H||(Oe?nt(r.STENCIL_TEST):mt(r.STENCIL_TEST));},setMask:function(Oe){Ct!==Oe&&!H&&(r.stencilMask(Oe),Ct=Oe);},setFunc:function(Oe,qs,yn){(ct!==Oe||Rt!==qs||Ot!==yn)&&(r.stencilFunc(Oe,qs,yn),ct=Oe,Rt=qs,Ot=yn);},setOp:function(Oe,qs,yn){(pt!==Oe||re!==qs||ee!==yn)&&(r.stencilOp(Oe,qs,yn),pt=Oe,re=qs,ee=yn);},setLocked:function(Oe){H=Oe;},setClear:function(Oe){je!==Oe&&(r.clearStencil(Oe),je=Oe);},reset:function(){H=!1,Ct=null,ct=null,Rt=null,Ot=null,pt=null,re=null,ee=null,je=null;}};}const n=new e(),o=new i(),a=new s(),l=new WeakMap(),c=new WeakMap();let h={},f={},u={},d=new WeakMap(),p=[],v=null,g=!1,x=null,m=null,w=null,y=null,_=null,M=null,A=null,b=new ThreeColor(0,0,0),S=0,E=!1,T=null,R=null,z=null,L=null,k=null;const U=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,G=0;const B=r.getParameter(r.VERSION);B.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(B)[1]),F=G>=1):B.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),F=G>=2);let q=null,X={};const vt=r.getParameter(r.SCISSOR_BOX),gt=r.getParameter(r.VIEWPORT),Qt=new ThreeVector4().fromArray(vt),te=new ThreeVector4().fromArray(gt);function Zt(H,Ct,ct,Rt){const Ot=new Uint8Array(4),pt=r.createTexture();r.bindTexture(H,pt),r.texParameteri(H,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(H,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let re=0;re<ct;re++)H===r.TEXTURE_3D||H===r.TEXTURE_2D_ARRAY?r.texImage3D(Ct,0,r.RGBA,1,1,Rt,0,r.RGBA,r.UNSIGNED_BYTE,Ot):r.texImage2D(Ct+re,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Ot);return pt;}const J={};J[r.TEXTURE_2D]=Zt(r.TEXTURE_2D,r.TEXTURE_2D,1),J[r.TEXTURE_CUBE_MAP]=Zt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[r.TEXTURE_2D_ARRAY]=Zt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),J[r.TEXTURE_3D]=Zt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),n.setClear(0,0,0,1),o.setClear(1),a.setClear(0),nt(r.DEPTH_TEST),o.setFunc(ThreeLessEqualDepth),ft(!1),wt(ThreeCullFaceBack),nt(r.CULL_FACE),ut(ThreeNoBlending);function nt(H){h[H]!==!0&&(r.enable(H),h[H]=!0);}function mt(H){h[H]!==!1&&(r.disable(H),h[H]=!1);}function Y(H,Ct){return u[H]!==Ct?(r.bindFramebuffer(H,Ct),u[H]=Ct,H===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=Ct),H===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=Ct),!0):!1;}function xt(H,Ct){let ct=p,Rt=!1;if(H){ct=d.get(Ct),ct===void 0&&(ct=[],d.set(Ct,ct));const Ot=H.textures;if(ct.length!==Ot.length||ct[0]!==r.COLOR_ATTACHMENT0){for(let pt=0,re=Ot.length;pt<re;pt++)ct[pt]=r.COLOR_ATTACHMENT0+pt;ct.length=Ot.length,Rt=!0;}}else ct[0]!==r.BACK&&(ct[0]=r.BACK,Rt=!0);Rt&&r.drawBuffers(ct);}function yt(H){return v!==H?(r.useProgram(H),v=H,!0):!1;}const fe={[ThreeAddEquation]:r.FUNC_ADD,[ThreeSubtractEquation]:r.FUNC_SUBTRACT,[ThreeReverseSubtractEquation]:r.FUNC_REVERSE_SUBTRACT};fe[ThreeMinEquation]=r.MIN,fe[ThreeMaxEquation]=r.MAX;const et={[ThreeZeroFactor]:r.ZERO,[ThreeOneFactor]:r.ONE,[ThreeSrcColorFactor]:r.SRC_COLOR,[ThreeSrcAlphaFactor]:r.SRC_ALPHA,[ThreeSrcAlphaSaturateFactor]:r.SRC_ALPHA_SATURATE,[ThreeDstColorFactor]:r.DST_COLOR,[ThreeDstAlphaFactor]:r.DST_ALPHA,[ThreeOneMinusSrcColorFactor]:r.ONE_MINUS_SRC_COLOR,[ThreeOneMinusSrcAlphaFactor]:r.ONE_MINUS_SRC_ALPHA,[ThreeOneMinusDstColorFactor]:r.ONE_MINUS_DST_COLOR,[ThreeOneMinusDstAlphaFactor]:r.ONE_MINUS_DST_ALPHA,[ThreeConstantColorFactor]:r.CONSTANT_COLOR,[ThreeOneMinusConstantColorFactor]:r.ONE_MINUS_CONSTANT_COLOR,[ThreeConstantAlphaFactor]:r.CONSTANT_ALPHA,[ThreeOneMinusConstantAlphaFactor]:r.ONE_MINUS_CONSTANT_ALPHA};function ut(H,Ct,ct,Rt,Ot,pt,re,ee,je,Oe){if(H===ThreeNoBlending){g===!0&&(mt(r.BLEND),g=!1);return;}if(g===!1&&(nt(r.BLEND),g=!0),H!==ThreeCustomBlending){if(H!==x||Oe!==E){if((m!==ThreeAddEquation||_!==ThreeAddEquation)&&(r.blendEquation(r.FUNC_ADD),m=ThreeAddEquation,_=ThreeAddEquation),Oe)switch(H){case ThreeNormalBlending:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case ThreeAdditiveBlending:r.blendFunc(r.ONE,r.ONE);break;case ThreeSubtractiveBlending:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ThreeMultiplyBlending:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Threeerror("WebGLState: Invalid blending: ",H);break;}else switch(H){case ThreeNormalBlending:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case ThreeAdditiveBlending:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case ThreeSubtractiveBlending:Threeerror("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ThreeMultiplyBlending:Threeerror("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Threeerror("WebGLState: Invalid blending: ",H);break;}w=null,y=null,M=null,A=null,b.set(0,0,0),S=0,x=H,E=Oe;}return;}Ot=Ot||Ct,pt=pt||ct,re=re||Rt,(Ct!==m||Ot!==_)&&(r.blendEquationSeparate(fe[Ct],fe[Ot]),m=Ct,_=Ot),(ct!==w||Rt!==y||pt!==M||re!==A)&&(r.blendFuncSeparate(et[ct],et[Rt],et[pt],et[re]),w=ct,y=Rt,M=pt,A=re),(ee.equals(b)===!1||je!==S)&&(r.blendColor(ee.r,ee.g,ee.b,je),b.copy(ee),S=je),x=H,E=!1;}function dt(H,Ct){H.side===ThreeDoubleSide?mt(r.CULL_FACE):nt(r.CULL_FACE);let ct=H.side===ThreeBackSide;Ct&&(ct=!ct),ft(ct),H.blending===ThreeNormalBlending&&H.transparent===!1?ut(ThreeNoBlending):ut(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),o.setFunc(H.depthFunc),o.setTest(H.depthTest),o.setMask(H.depthWrite),n.setMask(H.colorWrite);const Rt=H.stencilWrite;a.setTest(Rt),Rt&&(a.setMask(H.stencilWriteMask),a.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),a.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Ht(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?nt(r.SAMPLE_ALPHA_TO_COVERAGE):mt(r.SAMPLE_ALPHA_TO_COVERAGE);}function ft(H){T!==H&&(H?r.frontFace(r.CW):r.frontFace(r.CCW),T=H);}function wt(H){H!==ThreeCullFaceNone?(nt(r.CULL_FACE),H!==R&&(H===ThreeCullFaceBack?r.cullFace(r.BACK):H===ThreeCullFaceFront?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):mt(r.CULL_FACE),R=H;}function Wt(H){H!==z&&(F&&r.lineWidth(H),z=H);}function Ht(H,Ct,ct){H?(nt(r.POLYGON_OFFSET_FILL),(L!==Ct||k!==ct)&&(L=Ct,k=ct,o.getReversed()&&(Ct=-Ct),r.polygonOffset(Ct,ct))):mt(r.POLYGON_OFFSET_FILL);}function qt(H){H?nt(r.SCISSOR_TEST):mt(r.SCISSOR_TEST);}function ce(H){H===void 0&&(H=r.TEXTURE0+U-1),q!==H&&(r.activeTexture(H),q=H);}function O(H,Ct,ct){ct===void 0&&(q===null?ct=r.TEXTURE0+U-1:ct=q);let Rt=X[ct];Rt===void 0&&(Rt={type:void 0,texture:void 0},X[ct]=Rt),(Rt.type!==H||Rt.texture!==Ct)&&(q!==ct&&(r.activeTexture(ct),q=ct),r.bindTexture(H,Ct||J[H]),Rt.type=H,Rt.texture=Ct);}function Ae(){const H=X[q];H!==void 0&&H.type!==void 0&&(r.bindTexture(H.type,null),H.type=void 0,H.texture=void 0);}function de(){try{r.compressedTexImage2D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function D(){try{r.compressedTexImage3D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function P(){try{r.texSubImage2D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function W(){try{r.texSubImage3D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function Z(){try{r.compressedTexSubImage2D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function st(){try{r.compressedTexSubImage3D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function _t(){try{r.texStorage2D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function bt(){try{r.texStorage3D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function ot(){try{r.texImage2D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function lt(){try{r.texImage3D(...arguments);}catch(H){Threeerror("WebGLState:",H);}}function Tt(H){return f[H]!==void 0?f[H]:r.getParameter(H);}function ne(H,Ct){f[H]!==Ct&&(r.pixelStorei(H,Ct),f[H]=Ct);}function Dt(H){Qt.equals(H)===!1&&(r.scissor(H.x,H.y,H.z,H.w),Qt.copy(H));}function Et(H){te.equals(H)===!1&&(r.viewport(H.x,H.y,H.z,H.w),te.copy(H));}function oe(H,Ct){let ct=c.get(Ct);ct===void 0&&(ct=new WeakMap(),c.set(Ct,ct));let Rt=ct.get(H);Rt===void 0&&(Rt=r.getUniformBlockIndex(Ct,H.name),ct.set(H,Rt));}function ue(H,Ct){const Rt=c.get(Ct).get(H);l.get(Ct)!==Rt&&(r.uniformBlockBinding(Ct,Rt,H.__bindingPointIndex),l.set(Ct,Rt));}function we(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},f={},q=null,X={},u={},d=new WeakMap(),p=[],v=null,g=!1,x=null,m=null,w=null,y=null,_=null,M=null,A=null,b=new ThreeColor(0,0,0),S=0,E=!1,T=null,R=null,z=null,L=null,k=null,Qt.set(0,0,r.canvas.width,r.canvas.height),te.set(0,0,r.canvas.width,r.canvas.height),n.reset(),o.reset(),a.reset();}return{buffers:{color:n,depth:o,stencil:a},enable:nt,disable:mt,bindFramebuffer:Y,drawBuffers:xt,useProgram:yt,setBlending:ut,setMaterial:dt,setFlipSided:ft,setCullFace:wt,setLineWidth:Wt,setPolygonOffset:Ht,setScissorTest:qt,activeTexture:ce,bindTexture:O,unbindTexture:Ae,compressedTexImage2D:de,compressedTexImage3D:D,texImage2D:ot,texImage3D:lt,pixelStorei:ne,getParameter:Tt,updateUBOMapping:oe,uniformBlockBinding:ue,texStorage2D:_t,texStorage3D:bt,texSubImage2D:P,texSubImage3D:W,compressedTexSubImage2D:Z,compressedTexSubImage3D:st,scissor:Dt,viewport:Et,reset:we};}function sT(r,t,e,i,s,n,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ThreeVector2(),h=new WeakMap(),f=new Set();let u;const d=new WeakMap();let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null;}catch{}function v(D,P){return p?new OffscreenCanvas(D,P):ql("canvas");}function g(D,P,W){let Z=1;const st=de(D);if((st.width>W||st.height>W)&&(Z=W/Math.max(st.width,st.height)),Z<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const _t=Math.floor(Z*st.width),bt=Math.floor(Z*st.height);u===void 0&&(u=v(_t,bt));const ot=P?v(_t,bt):u;return ot.width=_t,ot.height=bt,ot.getContext("2d").drawImage(D,0,0,_t,bt),Threewarn("WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+_t+"x"+bt+")."),ot;}else return"data"in D&&Threewarn("WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),D;return D;}function x(D){return D.generateMipmaps;}function m(D){r.generateMipmap(D);}function w(D){return D.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?r.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D;}function y(D,P,W,Z,st,_t=!1){if(D!==null){if(r[D]!==void 0)return r[D];Threewarn("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'");}let bt;Z&&(bt=t.get("EXT_texture_norm16"),bt||Threewarn("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ot=P;if(P===r.RED&&(W===r.FLOAT&&(ot=r.R32F),W===r.HALF_FLOAT&&(ot=r.R16F),W===r.UNSIGNED_BYTE&&(ot=r.R8),W===r.UNSIGNED_SHORT&&bt&&(ot=bt.R16_EXT),W===r.SHORT&&bt&&(ot=bt.R16_SNORM_EXT)),P===r.RED_INTEGER&&(W===r.UNSIGNED_BYTE&&(ot=r.R8UI),W===r.UNSIGNED_SHORT&&(ot=r.R16UI),W===r.UNSIGNED_INT&&(ot=r.R32UI),W===r.BYTE&&(ot=r.R8I),W===r.SHORT&&(ot=r.R16I),W===r.INT&&(ot=r.R32I)),P===r.RG&&(W===r.FLOAT&&(ot=r.RG32F),W===r.HALF_FLOAT&&(ot=r.RG16F),W===r.UNSIGNED_BYTE&&(ot=r.RG8),W===r.UNSIGNED_SHORT&&bt&&(ot=bt.RG16_EXT),W===r.SHORT&&bt&&(ot=bt.RG16_SNORM_EXT)),P===r.RG_INTEGER&&(W===r.UNSIGNED_BYTE&&(ot=r.RG8UI),W===r.UNSIGNED_SHORT&&(ot=r.RG16UI),W===r.UNSIGNED_INT&&(ot=r.RG32UI),W===r.BYTE&&(ot=r.RG8I),W===r.SHORT&&(ot=r.RG16I),W===r.INT&&(ot=r.RG32I)),P===r.RGB_INTEGER&&(W===r.UNSIGNED_BYTE&&(ot=r.RGB8UI),W===r.UNSIGNED_SHORT&&(ot=r.RGB16UI),W===r.UNSIGNED_INT&&(ot=r.RGB32UI),W===r.BYTE&&(ot=r.RGB8I),W===r.SHORT&&(ot=r.RGB16I),W===r.INT&&(ot=r.RGB32I)),P===r.RGBA_INTEGER&&(W===r.UNSIGNED_BYTE&&(ot=r.RGBA8UI),W===r.UNSIGNED_SHORT&&(ot=r.RGBA16UI),W===r.UNSIGNED_INT&&(ot=r.RGBA32UI),W===r.BYTE&&(ot=r.RGBA8I),W===r.SHORT&&(ot=r.RGBA16I),W===r.INT&&(ot=r.RGBA32I)),P===r.RGB&&(W===r.UNSIGNED_SHORT&&bt&&(ot=bt.RGB16_EXT),W===r.SHORT&&bt&&(ot=bt.RGB16_SNORM_EXT),W===r.UNSIGNED_INT_5_9_9_9_REV&&(ot=r.RGB9_E5),W===r.UNSIGNED_INT_10F_11F_11F_REV&&(ot=r.R11F_G11F_B10F)),P===r.RGBA){const lt=_t?ThreeLinearTransfer:ThreeColorManagement.getTransfer(st);W===r.FLOAT&&(ot=r.RGBA32F),W===r.HALF_FLOAT&&(ot=r.RGBA16F),W===r.UNSIGNED_BYTE&&(ot=lt===ThreeSRGBTransfer?r.SRGB8_ALPHA8:r.RGBA8),W===r.UNSIGNED_SHORT&&bt&&(ot=bt.RGBA16_EXT),W===r.SHORT&&bt&&(ot=bt.RGBA16_SNORM_EXT),W===r.UNSIGNED_SHORT_4_4_4_4&&(ot=r.RGBA4),W===r.UNSIGNED_SHORT_5_5_5_1&&(ot=r.RGB5_A1);}return(ot===r.R16F||ot===r.R32F||ot===r.RG16F||ot===r.RG32F||ot===r.RGBA16F||ot===r.RGBA32F)&&t.get("EXT_color_buffer_float"),ot;}function _(D,P){let W;return D?P===null||P===ThreeUnsignedIntType||P===ThreeUnsignedInt248Type?W=r.DEPTH24_STENCIL8:P===ThreeFloatType?W=r.DEPTH32F_STENCIL8:P===ThreeUnsignedShortType&&(W=r.DEPTH24_STENCIL8,Threewarn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):P===null||P===ThreeUnsignedIntType||P===ThreeUnsignedInt248Type?W=r.DEPTH_COMPONENT24:P===ThreeFloatType?W=r.DEPTH_COMPONENT32F:P===ThreeUnsignedShortType&&(W=r.DEPTH_COMPONENT16),W;}function M(D,P){return x(D)===!0||D.isFramebufferTexture&&D.minFilter!==ThreeNearestFilter&&D.minFilter!==ThreeLinearFilter?Math.log2(Math.max(P.width,P.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?P.mipmaps.length:1;}function A(D){const P=D.target;P.removeEventListener("dispose",A),S(P),P.isVideoTexture&&h.delete(P),P.isHTMLTexture&&f.delete(P);}function b(D){const P=D.target;P.removeEventListener("dispose",b),T(P);}function S(D){const P=i.get(D);if(P.__webglInit===void 0)return;const W=D.source,Z=d.get(W);if(Z){const st=Z[P.__cacheKey];st.usedTimes--,st.usedTimes===0&&E(D),Object.keys(Z).length===0&&d.delete(W);}i.remove(D);}function E(D){const P=i.get(D);r.deleteTexture(P.__webglTexture);const W=D.source,Z=d.get(W);delete Z[P.__cacheKey],o.memory.textures--;}function T(D){const P=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(P.__webglFramebuffer[Z]))for(let st=0;st<P.__webglFramebuffer[Z].length;st++)r.deleteFramebuffer(P.__webglFramebuffer[Z][st]);else r.deleteFramebuffer(P.__webglFramebuffer[Z]);P.__webglDepthbuffer&&r.deleteRenderbuffer(P.__webglDepthbuffer[Z]);}else{if(Array.isArray(P.__webglFramebuffer))for(let Z=0;Z<P.__webglFramebuffer.length;Z++)r.deleteFramebuffer(P.__webglFramebuffer[Z]);else r.deleteFramebuffer(P.__webglFramebuffer);if(P.__webglDepthbuffer&&r.deleteRenderbuffer(P.__webglDepthbuffer),P.__webglMultisampledFramebuffer&&r.deleteFramebuffer(P.__webglMultisampledFramebuffer),P.__webglColorRenderbuffer)for(let Z=0;Z<P.__webglColorRenderbuffer.length;Z++)P.__webglColorRenderbuffer[Z]&&r.deleteRenderbuffer(P.__webglColorRenderbuffer[Z]);P.__webglDepthRenderbuffer&&r.deleteRenderbuffer(P.__webglDepthRenderbuffer);}const W=D.textures;for(let Z=0,st=W.length;Z<st;Z++){const _t=i.get(W[Z]);_t.__webglTexture&&(r.deleteTexture(_t.__webglTexture),o.memory.textures--),i.remove(W[Z]);}i.remove(D);}let R=0;function z(){R=0;}function L(){return R;}function k(D){R=D;}function U(){const D=R;return D>=s.maxTextures&&Threewarn("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),R+=1,D;}function F(D){const P=[];return P.push(D.wrapS),P.push(D.wrapT),P.push(D.wrapR||0),P.push(D.magFilter),P.push(D.minFilter),P.push(D.anisotropy),P.push(D.internalFormat),P.push(D.format),P.push(D.type),P.push(D.generateMipmaps),P.push(D.premultiplyAlpha),P.push(D.flipY),P.push(D.unpackAlignment),P.push(D.colorSpace),P.join();}function G(D,P){const W=i.get(D);if(D.isVideoTexture&&O(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&W.__version!==D.version){const Z=D.image;if(Z===null)Threewarn("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Threewarn("WebGLRenderer: Texture marked for update but image is incomplete");else{mt(W,D,P);return;}}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,W.__webglTexture,r.TEXTURE0+P);}function B(D,P){const W=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){mt(W,D,P);return;}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(r.TEXTURE_2D_ARRAY,W.__webglTexture,r.TEXTURE0+P);}function q(D,P){const W=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){mt(W,D,P);return;}e.bindTexture(r.TEXTURE_3D,W.__webglTexture,r.TEXTURE0+P);}function X(D,P){const W=i.get(D);if(D.isCubeDepthTexture!==!0&&D.version>0&&W.__version!==D.version){Y(W,D,P);return;}e.bindTexture(r.TEXTURE_CUBE_MAP,W.__webglTexture,r.TEXTURE0+P);}const vt={[ThreeRepeatWrapping]:r.REPEAT,[ThreeClampToEdgeWrapping]:r.CLAMP_TO_EDGE,[ThreeMirroredRepeatWrapping]:r.MIRRORED_REPEAT},gt={[ThreeNearestFilter]:r.NEAREST,[ThreeNearestMipmapNearestFilter]:r.NEAREST_MIPMAP_NEAREST,[ThreeNearestMipmapLinearFilter]:r.NEAREST_MIPMAP_LINEAR,[ThreeLinearFilter]:r.LINEAR,[ThreeLinearMipmapNearestFilter]:r.LINEAR_MIPMAP_NEAREST,[ThreeLinearMipmapLinearFilter]:r.LINEAR_MIPMAP_LINEAR},Qt={[ThreeNeverCompare]:r.NEVER,[ThreeAlwaysCompare]:r.ALWAYS,[ThreeLessCompare]:r.LESS,[ThreeLessEqualCompare]:r.LEQUAL,[ThreeEqualCompare]:r.EQUAL,[ThreeGreaterEqualCompare]:r.GEQUAL,[ThreeGreaterCompare]:r.GREATER,[ThreeNotEqualCompare]:r.NOTEQUAL};function te(D,P){if(P.type===ThreeFloatType&&t.has("OES_texture_float_linear")===!1&&(P.magFilter===ThreeLinearFilter||P.magFilter===ThreeLinearMipmapNearestFilter||P.magFilter===ThreeNearestMipmapLinearFilter||P.magFilter===ThreeLinearMipmapLinearFilter||P.minFilter===ThreeLinearFilter||P.minFilter===ThreeLinearMipmapNearestFilter||P.minFilter===ThreeNearestMipmapLinearFilter||P.minFilter===ThreeLinearMipmapLinearFilter)&&Threewarn("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(D,r.TEXTURE_WRAP_S,vt[P.wrapS]),r.texParameteri(D,r.TEXTURE_WRAP_T,vt[P.wrapT]),(D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY)&&r.texParameteri(D,r.TEXTURE_WRAP_R,vt[P.wrapR]),r.texParameteri(D,r.TEXTURE_MAG_FILTER,gt[P.magFilter]),r.texParameteri(D,r.TEXTURE_MIN_FILTER,gt[P.minFilter]),P.compareFunction&&(r.texParameteri(D,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(D,r.TEXTURE_COMPARE_FUNC,Qt[P.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(P.magFilter===ThreeNearestFilter||P.minFilter!==ThreeNearestMipmapLinearFilter&&P.minFilter!==ThreeLinearMipmapLinearFilter||P.type===ThreeFloatType&&t.has("OES_texture_float_linear")===!1)return;if(P.anisotropy>1||i.get(P).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");r.texParameterf(D,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(P.anisotropy,s.getMaxAnisotropy())),i.get(P).__currentAnisotropy=P.anisotropy;}}}function Zt(D,P){let W=!1;D.__webglInit===void 0&&(D.__webglInit=!0,P.addEventListener("dispose",A));const Z=P.source;let st=d.get(Z);st===void 0&&(st={},d.set(Z,st));const _t=F(P);if(_t!==D.__cacheKey){st[_t]===void 0&&(st[_t]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,W=!0),st[_t].usedTimes++;const bt=st[D.__cacheKey];bt!==void 0&&(st[D.__cacheKey].usedTimes--,bt.usedTimes===0&&E(P)),D.__cacheKey=_t,D.__webglTexture=st[_t].texture;}return W;}function J(D,P,W){return Math.floor(Math.floor(D/W)/P);}function nt(D,P,W,Z){const _t=D.updateRanges;if(_t.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,P.width,P.height,W,Z,P.data);else{_t.sort((ne,Dt)=>ne.start-Dt.start);let bt=0;for(let ne=1;ne<_t.length;ne++){const Dt=_t[bt],Et=_t[ne],oe=Dt.start+Dt.count,ue=J(Et.start,P.width,4),we=J(Dt.start,P.width,4);Et.start<=oe+1&&ue===we&&J(Et.start+Et.count-1,P.width,4)===ue?Dt.count=Math.max(Dt.count,Et.start+Et.count-Dt.start):(++bt,_t[bt]=Et);}_t.length=bt+1;const ot=e.getParameter(r.UNPACK_ROW_LENGTH),lt=e.getParameter(r.UNPACK_SKIP_PIXELS),Tt=e.getParameter(r.UNPACK_SKIP_ROWS);e.pixelStorei(r.UNPACK_ROW_LENGTH,P.width);for(let ne=0,Dt=_t.length;ne<Dt;ne++){const Et=_t[ne],oe=Math.floor(Et.start/4),ue=Math.ceil(Et.count/4),we=oe%P.width,H=Math.floor(oe/P.width),Ct=ue,ct=1;e.pixelStorei(r.UNPACK_SKIP_PIXELS,we),e.pixelStorei(r.UNPACK_SKIP_ROWS,H),e.texSubImage2D(r.TEXTURE_2D,0,we,H,Ct,ct,W,Z,P.data);}D.clearUpdateRanges(),e.pixelStorei(r.UNPACK_ROW_LENGTH,ot),e.pixelStorei(r.UNPACK_SKIP_PIXELS,lt),e.pixelStorei(r.UNPACK_SKIP_ROWS,Tt);}}function mt(D,P,W){let Z=r.TEXTURE_2D;(P.isDataArrayTexture||P.isCompressedArrayTexture)&&(Z=r.TEXTURE_2D_ARRAY),P.isData3DTexture&&(Z=r.TEXTURE_3D);const st=Zt(D,P),_t=P.source;e.bindTexture(Z,D.__webglTexture,r.TEXTURE0+W);const bt=i.get(_t);if(_t.version!==bt.__version||st===!0){if(e.activeTexture(r.TEXTURE0+W),(typeof ImageBitmap<"u"&&P.image instanceof ImageBitmap)===!1){const ct=ThreeColorManagement.getPrimaries(ThreeColorManagement.workingColorSpace),Rt=P.colorSpace===ThreeNoColorSpace?null:ThreeColorManagement.getPrimaries(P.colorSpace),Ot=P.colorSpace===ThreeNoColorSpace||ct===Rt?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,P.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);}e.pixelStorei(r.UNPACK_ALIGNMENT,P.unpackAlignment);let lt=g(P.image,!1,s.maxTextureSize);lt=Ae(P,lt);const Tt=n.convert(P.format,P.colorSpace),ne=n.convert(P.type);let Dt=y(P.internalFormat,Tt,ne,P.normalized,P.colorSpace,P.isVideoTexture);te(Z,P);let Et;const oe=P.mipmaps,ue=P.isVideoTexture!==!0,we=bt.__version===void 0||st===!0,H=_t.dataReady,Ct=M(P,lt);if(P.isDepthTexture)Dt=_(P.format===ThreeDepthStencilFormat,P.type),we&&(ue?e.texStorage2D(r.TEXTURE_2D,1,Dt,lt.width,lt.height):e.texImage2D(r.TEXTURE_2D,0,Dt,lt.width,lt.height,0,Tt,ne,null));else if(P.isDataTexture){if(oe.length>0){ue&&we&&e.texStorage2D(r.TEXTURE_2D,Ct,Dt,oe[0].width,oe[0].height);for(let ct=0,Rt=oe.length;ct<Rt;ct++)Et=oe[ct],ue?H&&e.texSubImage2D(r.TEXTURE_2D,ct,0,0,Et.width,Et.height,Tt,ne,Et.data):e.texImage2D(r.TEXTURE_2D,ct,Dt,Et.width,Et.height,0,Tt,ne,Et.data);P.generateMipmaps=!1;}else ue?(we&&e.texStorage2D(r.TEXTURE_2D,Ct,Dt,lt.width,lt.height),H&&nt(P,lt,Tt,ne)):e.texImage2D(r.TEXTURE_2D,0,Dt,lt.width,lt.height,0,Tt,ne,lt.data);}else if(P.isCompressedTexture){if(P.isCompressedArrayTexture){ue&&we&&e.texStorage3D(r.TEXTURE_2D_ARRAY,Ct,Dt,oe[0].width,oe[0].height,lt.depth);for(let ct=0,Rt=oe.length;ct<Rt;ct++)if(Et=oe[ct],P.format!==ThreeRGBAFormat){if(Tt!==null){if(ue){if(H)if(P.layerUpdates.size>0){const Ot=Ad(Et.width,Et.height,P.format,P.type);for(const pt of P.layerUpdates){const re=Et.data.subarray(pt*Ot/Et.data.BYTES_PER_ELEMENT,(pt+1)*Ot/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ct,0,0,pt,Et.width,Et.height,1,Tt,re);}}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ct,0,0,0,Et.width,Et.height,lt.depth,Tt,Et.data);}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ct,Dt,Et.width,Et.height,lt.depth,0,Et.data,0,0);}else Threewarn("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");}else ue?H&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,ct,0,0,0,Et.width,Et.height,lt.depth,Tt,ne,Et.data):e.texImage3D(r.TEXTURE_2D_ARRAY,ct,Dt,Et.width,Et.height,lt.depth,0,Tt,ne,Et.data);P.layerUpdates.size>0&&P.clearLayerUpdates();}else{ue&&we&&e.texStorage2D(r.TEXTURE_2D,Ct,Dt,oe[0].width,oe[0].height);for(let ct=0,Rt=oe.length;ct<Rt;ct++)Et=oe[ct],P.format!==ThreeRGBAFormat?Tt!==null?ue?H&&e.compressedTexSubImage2D(r.TEXTURE_2D,ct,0,0,Et.width,Et.height,Tt,Et.data):e.compressedTexImage2D(r.TEXTURE_2D,ct,Dt,Et.width,Et.height,0,Et.data):Threewarn("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ue?H&&e.texSubImage2D(r.TEXTURE_2D,ct,0,0,Et.width,Et.height,Tt,ne,Et.data):e.texImage2D(r.TEXTURE_2D,ct,Dt,Et.width,Et.height,0,Tt,ne,Et.data);}}else if(P.isDataArrayTexture){if(ue){if(we&&e.texStorage3D(r.TEXTURE_2D_ARRAY,Ct,Dt,lt.width,lt.height,lt.depth),H)if(P.layerUpdates.size>0){const ct=Ad(lt.width,lt.height,P.format,P.type);for(const Rt of P.layerUpdates){const Ot=lt.data.subarray(Rt*ct/lt.data.BYTES_PER_ELEMENT,(Rt+1)*ct/lt.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Rt,lt.width,lt.height,1,Tt,ne,Ot);}P.clearLayerUpdates();}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,Tt,ne,lt.data);}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Dt,lt.width,lt.height,lt.depth,0,Tt,ne,lt.data);}else if(P.isData3DTexture)ue?(we&&e.texStorage3D(r.TEXTURE_3D,Ct,Dt,lt.width,lt.height,lt.depth),H&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,Tt,ne,lt.data)):e.texImage3D(r.TEXTURE_3D,0,Dt,lt.width,lt.height,lt.depth,0,Tt,ne,lt.data);else if(P.isFramebufferTexture){if(we)if(ue)e.texStorage2D(r.TEXTURE_2D,Ct,Dt,lt.width,lt.height);else{let ct=lt.width,Rt=lt.height;for(let Ot=0;Ot<Ct;Ot++)e.texImage2D(r.TEXTURE_2D,Ot,Dt,ct,Rt,0,Tt,ne,null),ct>>=1,Rt>>=1;}}else if(P.isHTMLTexture){if("texElementImage2D"in r){const ct=r.canvas;if(ct.hasAttribute("layoutsubtree")||ct.setAttribute("layoutsubtree","true"),lt.parentNode!==ct){ct.appendChild(lt),f.add(P),ct.onpaint=Rt=>{const Ot=Rt.changedElements;for(const pt of f)Ot.includes(pt.image)&&(pt.needsUpdate=!0);},ct.requestPaint();return;}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,lt);else{const Ot=r.RGBA,pt=r.RGBA,re=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,Ot,pt,re,lt);}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE);}}else if(oe.length>0){if(ue&&we){const ct=de(oe[0]);e.texStorage2D(r.TEXTURE_2D,Ct,Dt,ct.width,ct.height);}for(let ct=0,Rt=oe.length;ct<Rt;ct++)Et=oe[ct],ue?H&&e.texSubImage2D(r.TEXTURE_2D,ct,0,0,Tt,ne,Et):e.texImage2D(r.TEXTURE_2D,ct,Dt,Tt,ne,Et);P.generateMipmaps=!1;}else if(ue){if(we){const ct=de(lt);e.texStorage2D(r.TEXTURE_2D,Ct,Dt,ct.width,ct.height);}H&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,Tt,ne,lt);}else e.texImage2D(r.TEXTURE_2D,0,Dt,Tt,ne,lt);x(P)&&m(Z),bt.__version=_t.version,P.onUpdate&&P.onUpdate(P);}D.__version=P.version;}function Y(D,P,W){if(P.image.length!==6)return;const Z=Zt(D,P),st=P.source;e.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+W);const _t=i.get(st);if(st.version!==_t.__version||Z===!0){e.activeTexture(r.TEXTURE0+W);const bt=ThreeColorManagement.getPrimaries(ThreeColorManagement.workingColorSpace),ot=P.colorSpace===ThreeNoColorSpace?null:ThreeColorManagement.getPrimaries(P.colorSpace),lt=P.colorSpace===ThreeNoColorSpace||bt===ot?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,P.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),e.pixelStorei(r.UNPACK_ALIGNMENT,P.unpackAlignment),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt);const Tt=P.isCompressedTexture||P.image[0].isCompressedTexture,ne=P.image[0]&&P.image[0].isDataTexture,Dt=[];for(let pt=0;pt<6;pt++)!Tt&&!ne?Dt[pt]=g(P.image[pt],!0,s.maxCubemapSize):Dt[pt]=ne?P.image[pt].image:P.image[pt],Dt[pt]=Ae(P,Dt[pt]);const Et=Dt[0],oe=n.convert(P.format,P.colorSpace),ue=n.convert(P.type),we=y(P.internalFormat,oe,ue,P.normalized,P.colorSpace),H=P.isVideoTexture!==!0,Ct=_t.__version===void 0||Z===!0,ct=st.dataReady;let Rt=M(P,Et);te(r.TEXTURE_CUBE_MAP,P);let Ot;if(Tt){H&&Ct&&e.texStorage2D(r.TEXTURE_CUBE_MAP,Rt,we,Et.width,Et.height);for(let pt=0;pt<6;pt++){Ot=Dt[pt].mipmaps;for(let re=0;re<Ot.length;re++){const ee=Ot[re];P.format!==ThreeRGBAFormat?oe!==null?H?ct&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re,0,0,ee.width,ee.height,oe,ee.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re,we,ee.width,ee.height,0,ee.data):Threewarn("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re,0,0,ee.width,ee.height,oe,ue,ee.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re,we,ee.width,ee.height,0,oe,ue,ee.data);}}}else{if(Ot=P.mipmaps,H&&Ct){Ot.length>0&&Rt++;const pt=de(Dt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,Rt,we,pt.width,pt.height);}for(let pt=0;pt<6;pt++)if(ne){H?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,Dt[pt].width,Dt[pt].height,oe,ue,Dt[pt].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,we,Dt[pt].width,Dt[pt].height,0,oe,ue,Dt[pt].data);for(let re=0;re<Ot.length;re++){const je=Ot[re].image[pt].image;H?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re+1,0,0,je.width,je.height,oe,ue,je.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re+1,we,je.width,je.height,0,oe,ue,je.data);}}else{H?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,oe,ue,Dt[pt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,we,oe,ue,Dt[pt]);for(let re=0;re<Ot.length;re++){const ee=Ot[re];H?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re+1,0,0,oe,ue,ee.image[pt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pt,re+1,we,oe,ue,ee.image[pt]);}}}x(P)&&m(r.TEXTURE_CUBE_MAP),_t.__version=st.version,P.onUpdate&&P.onUpdate(P);}D.__version=P.version;}function xt(D,P,W,Z,st,_t){const bt=n.convert(W.format,W.colorSpace),ot=n.convert(W.type),lt=y(W.internalFormat,bt,ot,W.normalized,W.colorSpace),Tt=i.get(P),ne=i.get(W);if(ne.__renderTarget=P,!Tt.__hasExternalTextures){const Dt=Math.max(1,P.width>>_t),Et=Math.max(1,P.height>>_t);st===r.TEXTURE_3D||st===r.TEXTURE_2D_ARRAY?e.texImage3D(st,_t,lt,Dt,Et,P.depth,0,bt,ot,null):e.texImage2D(st,_t,lt,Dt,Et,0,bt,ot,null);}e.bindFramebuffer(r.FRAMEBUFFER,D),ce(P)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Z,st,ne.__webglTexture,0,qt(P)):(st===r.TEXTURE_2D||st>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,Z,st,ne.__webglTexture,_t),e.bindFramebuffer(r.FRAMEBUFFER,null);}function yt(D,P,W){if(r.bindRenderbuffer(r.RENDERBUFFER,D),P.depthBuffer){const Z=P.depthTexture,st=Z&&Z.isDepthTexture?Z.type:null,_t=_(P.stencilBuffer,st),bt=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;ce(P)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,qt(P),_t,P.width,P.height):W?r.renderbufferStorageMultisample(r.RENDERBUFFER,qt(P),_t,P.width,P.height):r.renderbufferStorage(r.RENDERBUFFER,_t,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,bt,r.RENDERBUFFER,D);}else{const Z=P.textures;for(let st=0;st<Z.length;st++){const _t=Z[st],bt=n.convert(_t.format,_t.colorSpace),ot=n.convert(_t.type),lt=y(_t.internalFormat,bt,ot,_t.normalized,_t.colorSpace);ce(P)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,qt(P),lt,P.width,P.height):W?r.renderbufferStorageMultisample(r.RENDERBUFFER,qt(P),lt,P.width,P.height):r.renderbufferStorage(r.RENDERBUFFER,lt,P.width,P.height);}}r.bindRenderbuffer(r.RENDERBUFFER,null);}function fe(D,P,W){const Z=P.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(r.FRAMEBUFFER,D),!(P.depthTexture&&P.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const st=i.get(P.depthTexture);if(st.__renderTarget=P,(!st.__webglTexture||P.depthTexture.image.width!==P.width||P.depthTexture.image.height!==P.height)&&(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),Z){if(st.__webglInit===void 0&&(st.__webglInit=!0,P.depthTexture.addEventListener("dispose",A)),st.__webglTexture===void 0){st.__webglTexture=r.createTexture(),e.bindTexture(r.TEXTURE_CUBE_MAP,st.__webglTexture),te(r.TEXTURE_CUBE_MAP,P.depthTexture);const Tt=n.convert(P.depthTexture.format),ne=n.convert(P.depthTexture.type);let Dt;P.depthTexture.format===ThreeDepthFormat?Dt=r.DEPTH_COMPONENT24:P.depthTexture.format===ThreeDepthStencilFormat&&(Dt=r.DEPTH24_STENCIL8);for(let Et=0;Et<6;Et++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,Dt,P.width,P.height,0,Tt,ne,null);}}else G(P.depthTexture,0);const _t=st.__webglTexture,bt=qt(P),ot=Z?r.TEXTURE_CUBE_MAP_POSITIVE_X+W:r.TEXTURE_2D,lt=P.depthTexture.format===ThreeDepthStencilFormat?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(P.depthTexture.format===ThreeDepthFormat)ce(P)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,lt,ot,_t,0,bt):r.framebufferTexture2D(r.FRAMEBUFFER,lt,ot,_t,0);else if(P.depthTexture.format===ThreeDepthStencilFormat)ce(P)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,lt,ot,_t,0,bt):r.framebufferTexture2D(r.FRAMEBUFFER,lt,ot,_t,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.");}function et(D){const P=i.get(D),W=D.isWebGLCubeRenderTarget===!0;if(P.__boundDepthTexture!==D.depthTexture){const Z=D.depthTexture;if(P.__depthDisposeCallback&&P.__depthDisposeCallback(),Z){const st=()=>{delete P.__boundDepthTexture,delete P.__depthDisposeCallback,Z.removeEventListener("dispose",st);};Z.addEventListener("dispose",st),P.__depthDisposeCallback=st;}P.__boundDepthTexture=Z;}if(D.depthTexture&&!P.__autoAllocateDepthBuffer){if(W)for(let Z=0;Z<6;Z++)fe(P.__webglFramebuffer[Z],D,Z);else{const Z=D.texture.mipmaps;Z&&Z.length>0?fe(P.__webglFramebuffer[0],D,0):fe(P.__webglFramebuffer,D,0);}}else if(W){P.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(r.FRAMEBUFFER,P.__webglFramebuffer[Z]),P.__webglDepthbuffer[Z]===void 0)P.__webglDepthbuffer[Z]=r.createRenderbuffer(),yt(P.__webglDepthbuffer[Z],D,!1);else{const st=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,_t=P.__webglDepthbuffer[Z];r.bindRenderbuffer(r.RENDERBUFFER,_t),r.framebufferRenderbuffer(r.FRAMEBUFFER,st,r.RENDERBUFFER,_t);}}else{const Z=D.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(r.FRAMEBUFFER,P.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,P.__webglFramebuffer),P.__webglDepthbuffer===void 0)P.__webglDepthbuffer=r.createRenderbuffer(),yt(P.__webglDepthbuffer,D,!1);else{const st=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,_t=P.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,_t),r.framebufferRenderbuffer(r.FRAMEBUFFER,st,r.RENDERBUFFER,_t);}}e.bindFramebuffer(r.FRAMEBUFFER,null);}function ut(D,P,W){const Z=i.get(D);P!==void 0&&xt(Z.__webglFramebuffer,D,D.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),W!==void 0&&et(D);}function dt(D){const P=D.texture,W=i.get(D),Z=i.get(P);D.addEventListener("dispose",b);const st=D.textures,_t=D.isWebGLCubeRenderTarget===!0,bt=st.length>1;if(bt||(Z.__webglTexture===void 0&&(Z.__webglTexture=r.createTexture()),Z.__version=P.version,o.memory.textures++),_t){W.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(P.mipmaps&&P.mipmaps.length>0){W.__webglFramebuffer[ot]=[];for(let lt=0;lt<P.mipmaps.length;lt++)W.__webglFramebuffer[ot][lt]=r.createFramebuffer();}else W.__webglFramebuffer[ot]=r.createFramebuffer();}else{if(P.mipmaps&&P.mipmaps.length>0){W.__webglFramebuffer=[];for(let ot=0;ot<P.mipmaps.length;ot++)W.__webglFramebuffer[ot]=r.createFramebuffer();}else W.__webglFramebuffer=r.createFramebuffer();if(bt)for(let ot=0,lt=st.length;ot<lt;ot++){const Tt=i.get(st[ot]);Tt.__webglTexture===void 0&&(Tt.__webglTexture=r.createTexture(),o.memory.textures++);}if(D.samples>0&&ce(D)===!1){W.__webglMultisampledFramebuffer=r.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let ot=0;ot<st.length;ot++){const lt=st[ot];W.__webglColorRenderbuffer[ot]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,W.__webglColorRenderbuffer[ot]);const Tt=n.convert(lt.format,lt.colorSpace),ne=n.convert(lt.type),Dt=y(lt.internalFormat,Tt,ne,lt.normalized,lt.colorSpace,D.isXRRenderTarget===!0),Et=qt(D);r.renderbufferStorageMultisample(r.RENDERBUFFER,Et,Dt,D.width,D.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ot,r.RENDERBUFFER,W.__webglColorRenderbuffer[ot]);}r.bindRenderbuffer(r.RENDERBUFFER,null),D.depthBuffer&&(W.__webglDepthRenderbuffer=r.createRenderbuffer(),yt(W.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null);}}if(_t){e.bindTexture(r.TEXTURE_CUBE_MAP,Z.__webglTexture),te(r.TEXTURE_CUBE_MAP,P);for(let ot=0;ot<6;ot++)if(P.mipmaps&&P.mipmaps.length>0)for(let lt=0;lt<P.mipmaps.length;lt++)xt(W.__webglFramebuffer[ot][lt],D,P,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ot,lt);else xt(W.__webglFramebuffer[ot],D,P,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);x(P)&&m(r.TEXTURE_CUBE_MAP),e.unbindTexture();}else if(bt){for(let ot=0,lt=st.length;ot<lt;ot++){const Tt=st[ot],ne=i.get(Tt);let Dt=r.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Dt=D.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(Dt,ne.__webglTexture),te(Dt,Tt),xt(W.__webglFramebuffer,D,Tt,r.COLOR_ATTACHMENT0+ot,Dt,0),x(Tt)&&m(Dt);}e.unbindTexture();}else{let ot=r.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ot=D.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(ot,Z.__webglTexture),te(ot,P),P.mipmaps&&P.mipmaps.length>0)for(let lt=0;lt<P.mipmaps.length;lt++)xt(W.__webglFramebuffer[lt],D,P,r.COLOR_ATTACHMENT0,ot,lt);else xt(W.__webglFramebuffer,D,P,r.COLOR_ATTACHMENT0,ot,0);x(P)&&m(ot),e.unbindTexture();}D.depthBuffer&&et(D);}function ft(D){const P=D.textures;for(let W=0,Z=P.length;W<Z;W++){const st=P[W];if(x(st)){const _t=w(D),bt=i.get(st).__webglTexture;e.bindTexture(_t,bt),m(_t),e.unbindTexture();}}}const wt=[],Wt=[];function Ht(D){if(D.samples>0){if(ce(D)===!1){const P=D.textures,W=D.width,Z=D.height;let st=r.COLOR_BUFFER_BIT;const _t=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,bt=i.get(D),ot=P.length>1;if(ot)for(let Tt=0;Tt<P.length;Tt++)e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer);const lt=D.texture.mipmaps;lt&&lt.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,bt.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let Tt=0;Tt<P.length;Tt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(st|=r.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(st|=r.STENCIL_BUFFER_BIT)),ot){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,bt.__webglColorRenderbuffer[Tt]);const ne=i.get(P[Tt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ne,0);}r.blitFramebuffer(0,0,W,Z,0,0,W,Z,st,r.NEAREST),l===!0&&(wt.length=0,Wt.length=0,wt.push(r.COLOR_ATTACHMENT0+Tt),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&(wt.push(_t),Wt.push(_t),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Wt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,wt));}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ot)for(let Tt=0;Tt<P.length;Tt++){e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.RENDERBUFFER,bt.__webglColorRenderbuffer[Tt]);const ne=i.get(P[Tt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.TEXTURE_2D,ne,0);}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer);}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){const P=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[P]);}}}function qt(D){return Math.min(s.maxSamples,D.samples);}function ce(D){const P=i.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&P.__useRenderToTexture!==!1;}function O(D){const P=o.render.frame;h.get(D)!==P&&(h.set(D,P),D.update());}function Ae(D,P){const W=D.colorSpace,Z=D.format,st=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||W!==ThreeLinearSRGBColorSpace&&W!==ThreeNoColorSpace&&(ThreeColorManagement.getTransfer(W)===ThreeSRGBTransfer?(Z!==ThreeRGBAFormat||st!==ThreeUnsignedByteType)&&Threewarn("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Threeerror("WebGLTextures: Unsupported texture color space:",W)),P;}function de(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c;}this.allocateTextureUnit=U,this.resetTextureUnits=z,this.getTextureUnits=L,this.setTextureUnits=k,this.setTexture2D=G,this.setTexture2DArray=B,this.setTexture3D=q,this.setTextureCube=X,this.rebindTextures=ut,this.setupRenderTarget=dt,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=Ht,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=ce,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed();};}function ThreeWebGLUtils(r,t){function e(i,s=ThreeNoColorSpace){let n;const o=ThreeColorManagement.getTransfer(s);if(i===ThreeUnsignedByteType)return r.UNSIGNED_BYTE;if(i===ThreeUnsignedShort4444Type)return r.UNSIGNED_SHORT_4_4_4_4;if(i===ThreeUnsignedShort5551Type)return r.UNSIGNED_SHORT_5_5_5_1;if(i===ThreeUnsignedInt5999Type)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===ThreeUnsignedInt101111Type)return r.UNSIGNED_INT_10F_11F_11F_REV;if(i===ThreeByteType)return r.BYTE;if(i===ThreeShortType)return r.SHORT;if(i===ThreeUnsignedShortType)return r.UNSIGNED_SHORT;if(i===ThreeIntType)return r.INT;if(i===ThreeUnsignedIntType)return r.UNSIGNED_INT;if(i===ThreeFloatType)return r.FLOAT;if(i===ThreeHalfFloatType)return r.HALF_FLOAT;if(i===ThreeAlphaFormat)return r.ALPHA;if(i===ThreeRGBFormat)return r.RGB;if(i===ThreeRGBAFormat)return r.RGBA;if(i===ThreeDepthFormat)return r.DEPTH_COMPONENT;if(i===ThreeDepthStencilFormat)return r.DEPTH_STENCIL;if(i===ThreeRedFormat)return r.RED;if(i===ThreeRedIntegerFormat)return r.RED_INTEGER;if(i===ThreeRGFormat)return r.RG;if(i===ThreeRGIntegerFormat)return r.RG_INTEGER;if(i===ThreeRGBAIntegerFormat)return r.RGBA_INTEGER;if(i===ThreeRGB_S3TC_DXT1_Format||i===ThreeRGBA_S3TC_DXT1_Format||i===ThreeRGBA_S3TC_DXT3_Format||i===ThreeRGBA_S3TC_DXT5_Format)if(o===ThreeSRGBTransfer){if(n=t.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(i===ThreeRGB_S3TC_DXT1_Format)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ThreeRGBA_S3TC_DXT1_Format)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ThreeRGBA_S3TC_DXT3_Format)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ThreeRGBA_S3TC_DXT5_Format)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;}else return null;}else if(n=t.get("WEBGL_compressed_texture_s3tc"),n!==null){if(i===ThreeRGB_S3TC_DXT1_Format)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ThreeRGBA_S3TC_DXT1_Format)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ThreeRGBA_S3TC_DXT3_Format)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ThreeRGBA_S3TC_DXT5_Format)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT;}else return null;if(i===ThreeRGB_PVRTC_4BPPV1_Format||i===ThreeRGB_PVRTC_2BPPV1_Format||i===ThreeRGBA_PVRTC_4BPPV1_Format||i===ThreeRGBA_PVRTC_2BPPV1_Format)if(n=t.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(i===ThreeRGB_PVRTC_4BPPV1_Format)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ThreeRGB_PVRTC_2BPPV1_Format)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ThreeRGBA_PVRTC_4BPPV1_Format)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ThreeRGBA_PVRTC_2BPPV1_Format)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;}else return null;if(i===ThreeRGB_ETC1_Format||i===ThreeRGB_ETC2_Format||i===ThreeRGBA_ETC2_EAC_Format||i===ThreeR11_EAC_Format||i===ThreeSIGNED_R11_EAC_Format||i===ThreeRG11_EAC_Format||i===ThreeSIGNED_RG11_EAC_Format)if(n=t.get("WEBGL_compressed_texture_etc"),n!==null){if(i===ThreeRGB_ETC1_Format||i===ThreeRGB_ETC2_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===ThreeRGBA_ETC2_EAC_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC;if(i===ThreeR11_EAC_Format)return n.COMPRESSED_R11_EAC;if(i===ThreeSIGNED_R11_EAC_Format)return n.COMPRESSED_SIGNED_R11_EAC;if(i===ThreeRG11_EAC_Format)return n.COMPRESSED_RG11_EAC;if(i===ThreeSIGNED_RG11_EAC_Format)return n.COMPRESSED_SIGNED_RG11_EAC;}else return null;if(i===ThreeRGBA_ASTC_4x4_Format||i===ThreeRGBA_ASTC_5x4_Format||i===ThreeRGBA_ASTC_5x5_Format||i===ThreeRGBA_ASTC_6x5_Format||i===ThreeRGBA_ASTC_6x6_Format||i===ThreeRGBA_ASTC_8x5_Format||i===ThreeRGBA_ASTC_8x6_Format||i===ThreeRGBA_ASTC_8x8_Format||i===ThreeRGBA_ASTC_10x5_Format||i===ThreeRGBA_ASTC_10x6_Format||i===ThreeRGBA_ASTC_10x8_Format||i===ThreeRGBA_ASTC_10x10_Format||i===ThreeRGBA_ASTC_12x10_Format||i===ThreeRGBA_ASTC_12x12_Format)if(n=t.get("WEBGL_compressed_texture_astc"),n!==null){if(i===ThreeRGBA_ASTC_4x4_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ThreeRGBA_ASTC_5x4_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ThreeRGBA_ASTC_5x5_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ThreeRGBA_ASTC_6x5_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ThreeRGBA_ASTC_6x6_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ThreeRGBA_ASTC_8x5_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ThreeRGBA_ASTC_8x6_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ThreeRGBA_ASTC_8x8_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ThreeRGBA_ASTC_10x5_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ThreeRGBA_ASTC_10x6_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ThreeRGBA_ASTC_10x8_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ThreeRGBA_ASTC_10x10_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ThreeRGBA_ASTC_12x10_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ThreeRGBA_ASTC_12x12_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR;}else return null;if(i===ThreeRGBA_BPTC_Format||i===ThreeRGB_BPTC_SIGNED_Format||i===ThreeRGB_BPTC_UNSIGNED_Format)if(n=t.get("EXT_texture_compression_bptc"),n!==null){if(i===ThreeRGBA_BPTC_Format)return o===ThreeSRGBTransfer?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ThreeRGB_BPTC_SIGNED_Format)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ThreeRGB_BPTC_UNSIGNED_Format)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;}else return null;if(i===ThreeRED_RGTC1_Format||i===ThreeSIGNED_RED_RGTC1_Format||i===ThreeRED_GREEN_RGTC2_Format||i===ThreeSIGNED_RED_GREEN_RGTC2_Format)if(n=t.get("EXT_texture_compression_rgtc"),n!==null){if(i===ThreeRED_RGTC1_Format)return n.COMPRESSED_RED_RGTC1_EXT;if(i===ThreeSIGNED_RED_RGTC1_Format)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ThreeRED_GREEN_RGTC2_Format)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ThreeSIGNED_RED_GREEN_RGTC2_Format)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;}else return null;return i===ThreeUnsignedInt248Type?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null;}return{convert:e};}const nT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`;const oT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class rT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0;}init(t,e){if(this.texture===null){const i=new ThreeExternalTexture(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i;}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ThreeShaderMaterial({vertexShader:nT,fragmentShader:oT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ThreeMesh(new ThreePlaneGeometry(20,20),i);}return this.mesh;}reset(){this.texture=null,this.mesh=null;}getDepthTexture(){return this.texture;}}class aT extends ThreeEventDispatcher{constructor(t,e){super();const i=this;let s=null,n=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null;const v=typeof XRWebGLBinding<"u",g=new rT(),x={},m=e.getContextAttributes();let w=null,y=null;const _=[],M=[],A=new ThreeVector2();let b=null,S=null;const E=new ThreePerspectiveCamera();E.viewport=new ThreeVector4();const T=new ThreePerspectiveCamera();T.viewport=new ThreeVector4();const R=[E,T],z=new ThreeArrayCamera();let L=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let nt=_[J];return nt===void 0&&(nt=new ThreeWebXRController(),_[J]=nt),nt.getTargetRaySpace();},this.getControllerGrip=function(J){let nt=_[J];return nt===void 0&&(nt=new ThreeWebXRController(),_[J]=nt),nt.getGripSpace();},this.getHand=function(J){let nt=_[J];return nt===void 0&&(nt=new ThreeWebXRController(),_[J]=nt),nt.getHandSpace();};function U(J){const nt=M.indexOf(J.inputSource);if(nt===-1)return;const mt=_[nt];mt!==void 0&&(mt.update(J.inputSource,J.frame,c||o),mt.dispatchEvent({type:J.type,data:J.inputSource}));}function F(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",G);for(let J=0;J<_.length;J++){const nt=M[J];nt!==null&&(M[J]=null,_[J].disconnect(nt));}L=null,k=null,g.reset();for(const J in x)delete x[J];if(t.setRenderTarget(w),d=null,u=null,f=null,s=null,y=null,Zt.stop(),i.isPresenting=!1,t.setPixelRatio(b),t.setSize(A.width,A.height,!1),S!==null){const J=S.camera;J.fov=S.fov,J.zoom=S.zoom,J.updateProjectionMatrix(),S=null;}i.dispatchEvent({type:"sessionend"});}this.setFramebufferScaleFactor=function(J){n=J,i.isPresenting===!0&&Threewarn("WebXRManager: Cannot change framebuffer scale while presenting.");},this.setReferenceSpaceType=function(J){a=J,i.isPresenting===!0&&Threewarn("WebXRManager: Cannot change reference space type while presenting.");},this.getReferenceSpace=function(){return c||o;},this.setReferenceSpace=function(J){c=J;},this.getBaseLayer=function(){return u!==null?u:d;},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(s,e)),f;},this.getFrame=function(){return p;},this.getSession=function(){return s;},this.setSession=async function(J){if(s=J,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",F),s.addEventListener("inputsourceschange",G),m.xrCompatible!==!0&&(await e.makeXRCompatible()),b=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let mt=null,Y=null,xt=null;m.depth&&(xt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,mt=m.stencil?ThreeDepthStencilFormat:ThreeDepthFormat,Y=m.stencil?ThreeUnsignedInt248Type:ThreeUnsignedIntType);const yt={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:n};f=this.getBinding(),u=f.createProjectionLayer(yt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new ThreeWebGLRenderTarget(u.textureWidth,u.textureHeight,{format:ThreeRGBAFormat,type:ThreeUnsignedByteType,depthTexture:new ThreeDepthTexture(u.textureWidth,u.textureHeight,Y,void 0,void 0,void 0,void 0,void 0,void 0,mt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1});}else{const mt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:n};d=new XRWebGLLayer(s,e,mt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new ThreeWebGLRenderTarget(d.framebufferWidth,d.framebufferHeight,{format:ThreeRGBAFormat,type:ThreeUnsignedByteType,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1});}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Zt.setContext(s),Zt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"});}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode;},this.getDepthTexture=function(){return g.getDepthTexture();};function G(J){for(let nt=0;nt<J.removed.length;nt++){const mt=J.removed[nt],Y=M.indexOf(mt);Y>=0&&(M[Y]=null,_[Y].disconnect(mt));}for(let nt=0;nt<J.added.length;nt++){const mt=J.added[nt];let Y=M.indexOf(mt);if(Y===-1){for(let yt=0;yt<_.length;yt++)if(yt>=M.length){M.push(mt),Y=yt;break;}else if(M[yt]===null){M[yt]=mt,Y=yt;break;}if(Y===-1)break;}const xt=_[Y];xt&&xt.connect(mt);}}const B=new ThreeVector3(),q=new ThreeVector3();function X(J,nt,mt){B.setFromMatrixPosition(nt.matrixWorld),q.setFromMatrixPosition(mt.matrixWorld);const Y=B.distanceTo(q),xt=nt.projectionMatrix.elements,yt=mt.projectionMatrix.elements,fe=xt[14]/(xt[10]-1),et=xt[14]/(xt[10]+1),ut=(xt[9]+1)/xt[5],dt=(xt[9]-1)/xt[5],ft=(xt[8]-1)/xt[0],wt=(yt[8]+1)/yt[0],Wt=fe*ft,Ht=fe*wt,qt=Y/(-ft+wt),ce=qt*-ft;if(nt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ce),J.translateZ(qt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),xt[10]===-1)J.projectionMatrix.copy(nt.projectionMatrix),J.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const O=fe+qt,Ae=et+qt,de=Wt-ce,D=Ht+(Y-ce),P=ut*et/Ae*O,W=dt*et/Ae*O;J.projectionMatrix.makePerspective(de,D,P,W,O,Ae),J.projectionMatrixInverse.copy(J.projectionMatrix).invert();}}function vt(J,nt){nt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(nt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert();}this.updateCamera=function(J){if(s===null)return;let nt=J.near,mt=J.far;g.texture!==null&&(g.depthNear>0&&(nt=g.depthNear),g.depthFar>0&&(mt=g.depthFar)),z.near=T.near=E.near=nt,z.far=T.far=E.far=mt,(L!==z.near||k!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),L=z.near,k=z.far),z.layers.mask=J.layers.mask|6,E.layers.mask=z.layers.mask&-5,T.layers.mask=z.layers.mask&-3;const Y=J.parent,xt=z.cameras;vt(z,Y);for(let yt=0;yt<xt.length;yt++)vt(xt[yt],Y);xt.length===2?X(z,E,T):z.projectionMatrix.copy(E.projectionMatrix),S===null&&J.isPerspectiveCamera&&(S={camera:J,fov:J.fov,zoom:J.zoom}),gt(J,z,Y);};function gt(J,nt,mt){mt===null?J.matrix.copy(nt.matrixWorld):(J.matrix.copy(mt.matrixWorld),J.matrix.invert(),J.matrix.multiply(nt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(nt.projectionMatrix),J.projectionMatrixInverse.copy(nt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Ta*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1);}this.getCamera=function(){return z;},this.getFoveation=function(){if(!(u===null&&d===null))return l;},this.setFoveation=function(J){l=J,u!==null&&(u.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J);},this.hasDepthSensing=function(){return g.texture!==null;},this.getDepthSensingMesh=function(){return g.getMesh(z);},this.getCameraTexture=function(J){return x[J];};let Qt=null;function te(J,nt){if(h=nt.getViewerPose(c||o),p=nt,h!==null){const mt=h.views;d!==null&&(t.setRenderTargetFramebuffer(y,d.framebuffer),t.setRenderTarget(y));let Y=!1;mt.length!==z.cameras.length&&(z.cameras.length=0,Y=!0);for(let et=0;et<mt.length;et++){const ut=mt[et];let dt=null;if(d!==null)dt=d.getViewport(ut);else{const wt=f.getViewSubImage(u,ut);dt=wt.viewport,et===0&&(t.setRenderTargetTextures(y,wt.colorTexture,wt.depthStencilTexture),t.setRenderTarget(y));}let ft=R[et];ft===void 0&&(ft=new ThreePerspectiveCamera(),ft.layers.enable(et),ft.viewport=new ThreeVector4(),R[et]=ft),ft.matrix.fromArray(ut.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(ut.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(dt.x,dt.y,dt.width,dt.height),et===0&&(z.matrix.copy(ft.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Y===!0&&z.cameras.push(ft);}const xt=s.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){f=i.getBinding();const et=f.getDepthInformation(mt[0]);et&&et.isValid&&et.texture&&g.init(et,s.renderState);}if(xt&&xt.includes("camera-access")&&v){t.state.unbindTexture(),f=i.getBinding();for(let et=0;et<mt.length;et++){const ut=mt[et].camera;if(ut){let dt=x[ut];dt||(dt=new ThreeExternalTexture(),x[ut]=dt);const ft=f.getCameraImage(ut);dt.sourceTexture=ft;}}}}for(let mt=0;mt<_.length;mt++){const Y=M[mt],xt=_[mt];Y!==null&&xt!==void 0&&xt.update(Y,nt,c||o);}Qt&&Qt(J,nt),nt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:nt}),p=null;}const Zt=new wy();Zt.setAnimationLoop(te),this.setAnimationLoop=function(J){Qt=J;},this.dispose=function(){};}}const lT=new ThreeMatrix4();const Ey=new ThreeMatrix3();Ey.set(-1,0,0,0,1,0,0,0,1);function cT(r,t){function e(g,x){g.matrixAutoUpdate===!0&&g.updateMatrix(),x.value.copy(g.matrix);}function i(g,x){x.color.getRGB(g.fogColor.value,Xx(r)),x.isFog?(g.fogNear.value=x.near,g.fogFar.value=x.far):x.isFogExp2&&(g.fogDensity.value=x.density);}function s(g,x,m,w,y){x.isNodeMaterial?x.uniformsNeedUpdate=!1:x.isMeshBasicMaterial?n(g,x):x.isMeshLambertMaterial?(n(g,x),x.envMap&&(g.envMapIntensity.value=x.envMapIntensity)):x.isMeshToonMaterial?(n(g,x),f(g,x)):x.isMeshPhongMaterial?(n(g,x),h(g,x),x.envMap&&(g.envMapIntensity.value=x.envMapIntensity)):x.isMeshStandardMaterial?(n(g,x),u(g,x),x.isMeshPhysicalMaterial&&d(g,x,y)):x.isMeshMatcapMaterial?(n(g,x),p(g,x)):x.isMeshDepthMaterial?n(g,x):x.isMeshDistanceMaterial?(n(g,x),v(g,x)):x.isMeshNormalMaterial?n(g,x):x.isLineBasicMaterial?(o(g,x),x.isLineDashedMaterial&&a(g,x)):x.isPointsMaterial?l(g,x,m,w):x.isSpriteMaterial?c(g,x):x.isShadowMaterial?(g.color.value.copy(x.color),g.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1);}function n(g,x){g.opacity.value=x.opacity,x.color&&g.diffuse.value.copy(x.color),x.emissive&&g.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(g.map.value=x.map,e(x.map,g.mapTransform)),x.alphaMap&&(g.alphaMap.value=x.alphaMap,e(x.alphaMap,g.alphaMapTransform)),x.bumpMap&&(g.bumpMap.value=x.bumpMap,e(x.bumpMap,g.bumpMapTransform),g.bumpScale.value=x.bumpScale,x.side===ThreeBackSide&&(g.bumpScale.value*=-1)),x.normalMap&&(g.normalMap.value=x.normalMap,e(x.normalMap,g.normalMapTransform),g.normalScale.value.copy(x.normalScale),x.side===ThreeBackSide&&g.normalScale.value.negate()),x.displacementMap&&(g.displacementMap.value=x.displacementMap,e(x.displacementMap,g.displacementMapTransform),g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias),x.emissiveMap&&(g.emissiveMap.value=x.emissiveMap,e(x.emissiveMap,g.emissiveMapTransform)),x.specularMap&&(g.specularMap.value=x.specularMap,e(x.specularMap,g.specularMapTransform)),x.alphaTest>0&&(g.alphaTest.value=x.alphaTest);const m=t.get(x),w=m.envMap,y=m.envMapRotation;w&&(g.envMap.value=w,g.envMapRotation.value.setFromMatrix4(lT.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Ey),g.reflectivity.value=x.reflectivity,g.ior.value=x.ior,g.refractionRatio.value=x.refractionRatio),x.lightMap&&(g.lightMap.value=x.lightMap,g.lightMapIntensity.value=x.lightMapIntensity,e(x.lightMap,g.lightMapTransform)),x.aoMap&&(g.aoMap.value=x.aoMap,g.aoMapIntensity.value=x.aoMapIntensity,e(x.aoMap,g.aoMapTransform));}function o(g,x){g.diffuse.value.copy(x.color),g.opacity.value=x.opacity,x.map&&(g.map.value=x.map,e(x.map,g.mapTransform));}function a(g,x){g.dashSize.value=x.dashSize,g.totalSize.value=x.dashSize+x.gapSize,g.scale.value=x.scale;}function l(g,x,m,w){g.diffuse.value.copy(x.color),g.opacity.value=x.opacity,g.size.value=x.size*m,g.scale.value=w*.5,x.map&&(g.map.value=x.map,e(x.map,g.uvTransform)),x.alphaMap&&(g.alphaMap.value=x.alphaMap,e(x.alphaMap,g.alphaMapTransform)),x.alphaTest>0&&(g.alphaTest.value=x.alphaTest);}function c(g,x){g.diffuse.value.copy(x.color),g.opacity.value=x.opacity,g.rotation.value=x.rotation,x.map&&(g.map.value=x.map,e(x.map,g.mapTransform)),x.alphaMap&&(g.alphaMap.value=x.alphaMap,e(x.alphaMap,g.alphaMapTransform)),x.alphaTest>0&&(g.alphaTest.value=x.alphaTest);}function h(g,x){g.specular.value.copy(x.specular),g.shininess.value=Math.max(x.shininess,1e-4);}function f(g,x){x.gradientMap&&(g.gradientMap.value=x.gradientMap);}function u(g,x){g.metalness.value=x.metalness,x.metalnessMap&&(g.metalnessMap.value=x.metalnessMap,e(x.metalnessMap,g.metalnessMapTransform)),g.roughness.value=x.roughness,x.roughnessMap&&(g.roughnessMap.value=x.roughnessMap,e(x.roughnessMap,g.roughnessMapTransform)),x.envMap&&(g.envMapIntensity.value=x.envMapIntensity);}function d(g,x,m){g.ior.value=x.ior,x.sheen>0&&(g.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),g.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(g.sheenColorMap.value=x.sheenColorMap,e(x.sheenColorMap,g.sheenColorMapTransform)),x.sheenRoughnessMap&&(g.sheenRoughnessMap.value=x.sheenRoughnessMap,e(x.sheenRoughnessMap,g.sheenRoughnessMapTransform))),x.clearcoat>0&&(g.clearcoat.value=x.clearcoat,g.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(g.clearcoatMap.value=x.clearcoatMap,e(x.clearcoatMap,g.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,e(x.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(g.clearcoatNormalMap.value=x.clearcoatNormalMap,e(x.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===ThreeBackSide&&g.clearcoatNormalScale.value.negate())),x.dispersion>0&&(g.dispersion.value=x.dispersion),x.retroreflectivity>0&&(g.retroreflectivity.value=x.retroreflectivity),x.iridescence>0&&(g.iridescence.value=x.iridescence,g.iridescenceIOR.value=x.iridescenceIOR,g.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(g.iridescenceMap.value=x.iridescenceMap,e(x.iridescenceMap,g.iridescenceMapTransform)),x.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=x.iridescenceThicknessMap,e(x.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),x.transmission>0&&(g.transmission.value=x.transmission,g.transmissionSamplerMap.value=m.texture,g.transmissionSamplerSize.value.set(m.width,m.height),x.transmissionMap&&(g.transmissionMap.value=x.transmissionMap,e(x.transmissionMap,g.transmissionMapTransform)),g.thickness.value=x.thickness,x.thicknessMap&&(g.thicknessMap.value=x.thicknessMap,e(x.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=x.attenuationDistance,g.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(g.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(g.anisotropyMap.value=x.anisotropyMap,e(x.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=x.specularIntensity,g.specularColor.value.copy(x.specularColor),x.specularColorMap&&(g.specularColorMap.value=x.specularColorMap,e(x.specularColorMap,g.specularColorMapTransform)),x.specularIntensityMap&&(g.specularIntensityMap.value=x.specularIntensityMap,e(x.specularIntensityMap,g.specularIntensityMapTransform));}function p(g,x){x.matcap&&(g.matcap.value=x.matcap);}function v(g,x){const m=t.get(x).light;g.referencePosition.value.setFromMatrixPosition(m.matrixWorld),g.nearDistance.value=m.shadow.camera.near,g.farDistance.value=m.shadow.camera.far;}return{refreshFogUniforms:i,refreshMaterialUniforms:s};}function hT(r,t,e,i){let s={},n={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,_){const M=_.program;i.uniformBlockBinding(y,M);}function c(y,_){let M=s[y.id];M===void 0&&(g(y),M=h(y),s[y.id]=M,y.addEventListener("dispose",m));const A=_.program;i.updateUBOMapping(y,A);const b=t.render.frame;n[y.id]!==b&&(u(y),n[y.id]=b);}function h(y){const _=f();y.__bindingPointIndex=_;const M=r.createBuffer(),A=y.__size,b=y.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,A,b),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,_,M),M;}function f(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return Threeerror("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0;}function u(y){const _=s[y.id],M=y.uniforms,A=y.__cache;r.bindBuffer(r.UNIFORM_BUFFER,_);for(let b=0,S=M.length;b<S;b++){const E=M[b];if(Array.isArray(E))for(let T=0,R=E.length;T<R;T++)d(E[T],b,T,A);else d(E,b,0,A);}r.bindBuffer(r.UNIFORM_BUFFER,null);}function d(y,_,M,A){if(v(y,_,M,A)===!0){const b=y.__offset,S=y.value;if(Array.isArray(S)){let E=0;for(let T=0;T<S.length;T++){const R=S[T],z=x(R);p(R,y.__data,E),typeof R!="number"&&typeof R!="boolean"&&!R.isMatrix3&&!ArrayBuffer.isView(R)&&(E+=z.storage/Float32Array.BYTES_PER_ELEMENT);}}else p(S,y.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,b,y.__data);}}function p(y,_,M){typeof y=="number"||typeof y=="boolean"?_[0]=y:y.isMatrix3?(_[0]=y.elements[0],_[1]=y.elements[1],_[2]=y.elements[2],_[3]=0,_[4]=y.elements[3],_[5]=y.elements[4],_[6]=y.elements[5],_[7]=0,_[8]=y.elements[6],_[9]=y.elements[7],_[10]=y.elements[8],_[11]=0):ArrayBuffer.isView(y)?_.set(new y.constructor(y.buffer,y.byteOffset,_.length)):y.toArray(_,M);}function v(y,_,M,A){const b=y.value,S=_+"_"+M;if(A[S]===void 0)return typeof b=="number"||typeof b=="boolean"?A[S]=b:ArrayBuffer.isView(b)?A[S]=b.slice():A[S]=b.clone(),!0;{const E=A[S];if(typeof b=="number"||typeof b=="boolean"){if(E!==b)return A[S]=b,!0;}else{if(ArrayBuffer.isView(b))return!0;if(E.equals(b)===!1)return E.copy(b),!0;}}return!1;}function g(y){const _=y.uniforms;let M=0;const A=16;for(let S=0,E=_.length;S<E;S++){const T=Array.isArray(_[S])?_[S]:[_[S]];for(let R=0,z=T.length;R<z;R++){const L=T[R],k=Array.isArray(L.value)?L.value:[L.value];for(let U=0,F=k.length;U<F;U++){const G=k[U],B=x(G),q=M%A,X=q%B.boundary,vt=q+X;M+=X,vt!==0&&A-vt<B.storage&&(M+=A-vt),L.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=M,M+=B.storage;}}}const b=M%A;return b>0&&(M+=A-b),y.__size=M,y.__cache={},this;}function x(y){const _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?Threewarn("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(_.boundary=16,_.storage=y.byteLength):Threewarn("WebGLRenderer: Unsupported uniform value type.",y),_;}function m(y){const _=y.target;_.removeEventListener("dispose",m);const M=o.indexOf(_.__bindingPointIndex);o.splice(M,1),r.deleteBuffer(s[_.id]),delete s[_.id],delete n[_.id];}function w(){for(const y in s)r.deleteBuffer(s[y]);o=[],s={},n={};}return{bind:l,update:c,dispose:w};}const uT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let bn=null;function fT(){return bn===null&&(bn=new ThreeDataTexture(uT,16,16,ThreeRGFormat,ThreeHalfFloatType),bn.name="DFG_LUT",bn.minFilter=ThreeLinearFilter,bn.magFilter=ThreeLinearFilter,bn.wrapS=ThreeClampToEdgeWrapping,bn.wrapT=ThreeClampToEdgeWrapping,bn.generateMipmaps=!1,bn.needsUpdate=!0),bn;}class ThreeWebGLRenderer{constructor(t={}){const{canvas:e=ThreecreateCanvasElement(),context:i=null,depth:s=!0,stencil:n=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=ThreeUnsignedByteType}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha;}else p=o;const v=d,g=new Set([ThreeRGBAIntegerFormat,ThreeRGIntegerFormat,ThreeRedIntegerFormat]),x=new Set([ThreeUnsignedByteType,ThreeUnsignedIntType,ThreeUnsignedShortType,ThreeUnsignedInt248Type,ThreeUnsignedShort4444Type,ThreeUnsignedShort5551Type]),m=new Uint32Array(4),w=new Int32Array(4),y=new ThreeVector3();let _=null,M=null;const A=[],b=[];let S=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ThreeNoToneMapping,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let T=!1,R=null,z=null,L=null,k=null;this._outputColorSpace=ThreeSRGBColorSpace;let U=0,F=0,G=null,B=-1,q=null;const X=new ThreeVector4(),vt=new ThreeVector4();let gt=null;const Qt=new ThreeColor(0);let te=0,Zt=e.width,J=e.height,nt=1,mt=null,Y=null;const xt=new ThreeVector4(0,0,Zt,J),yt=new ThreeVector4(0,0,Zt,J);let fe=!1;const et=new ThreeFrustum();let ut=!1,dt=!1;const ft=new ThreeMatrix4(),wt=new ThreeVector3(),Wt=new ThreeVector4(),Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function ce(){return G===null?nt:1;}let O=i;function Ae(I,V){return e.getContext(I,V);}let de,D,P,W,Z,st,_t,bt,ot,lt,Tt,ne,Dt,Et,oe,ue,we,H,Ct,ct,Rt,Ot,pt;try{const I={alpha:!0,depth:s,stencil:n,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ThreeREVISION}`),e.addEventListener("webglcontextlost",je,!1),e.addEventListener("webglcontextrestored",Oe,!1),e.addEventListener("webglcontextcreationerror",qs,!1),O===null){const V="webgl2";if(O=Ae(V,I),O===null)throw Ae(V)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.");}re();}catch(I){throw e.removeEventListener("webglcontextlost",je,!1),e.removeEventListener("webglcontextrestored",Oe,!1),e.removeEventListener("webglcontextcreationerror",qs,!1),Threeerror("WebGLRenderer: "+I.message),I;}function re(){de=new d5(O),de.init(),Rt=new ThreeWebGLUtils(O,de),D=new s5(O,de,t,Rt),P=new iT(O,de),D.reversedDepthBuffer&&u&&P.buffers.depth.setReversed(!0),z=O.createFramebuffer(),L=O.createFramebuffer(),k=O.createFramebuffer(),W=new g5(O),Z=new GA(),st=new sT(O,de,P,Z,D,Rt,W),_t=new f5(E),bt=new xM(O),Ot=new e5(O,bt),ot=new p5(O,bt,W,Ot),lt=new x5(O,ot,bt,Ot,W),H=new v5(O,D,st),oe=new n5(Z),Tt=new VA(E,_t,de,D,Ot,oe),ne=new cT(E,Z),Dt=new WA(),Et=new jA(de),we=new t5(E,_t,P,lt,p,l),ue=new eT(E,lt,D),pt=new hT(O,W,D,P),Ct=new i5(O,de,W),ct=new m5(O,de,W),W.programs=Tt.programs,E.capabilities=D,E.extensions=de,E.properties=Z,E.renderLists=Dt,E.shadowMap=ue,E.state=P,E.info=W;}v!==ThreeUnsignedByteType&&(S=new w5(v,e.width,e.height,a,s,n));const ee=new aT(E,O);this.xr=ee,this.getContext=function(){return O;},this.getContextAttributes=function(){return O.getContextAttributes();},this.forceContextLoss=function(){const I=de.get("WEBGL_lose_context");I&&I.loseContext();},this.forceContextRestore=function(){const I=de.get("WEBGL_lose_context");I&&I.restoreContext();},this.getPixelRatio=function(){return nt;},this.setPixelRatio=function(I){I!==void 0&&(nt=I,this.setSize(Zt,J,!1));},this.getSize=function(I){return I.set(Zt,J);},this.setSize=function(I,V,tt=!0){if(ee.isPresenting){Threewarn("WebGLRenderer: Can't change size while VR device is presenting.");return;}Zt=I,J=V,e.width=Math.floor(I*nt),e.height=Math.floor(V*nt),tt===!0&&(e.style.width=I+"px",e.style.height=V+"px"),S!==null&&S.setSize(e.width,e.height),this.setViewport(0,0,I,V);},this.getDrawingBufferSize=function(I){return I.set(Zt*nt,J*nt).floor();},this.setDrawingBufferSize=function(I,V,tt){Zt=I,J=V,nt=tt,e.width=Math.floor(I*tt),e.height=Math.floor(V*tt),this.setViewport(0,0,I,V);},this.setEffects=function(I){if(v===ThreeUnsignedByteType){Threeerror("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return;}if(I){for(let V=0;V<I.length;V++)if(I[V].isOutputPass===!0){Threewarn("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break;}}S.setEffects(I||[]);},this.getCurrentViewport=function(I){return I.copy(X);},this.getViewport=function(I){return I.copy(xt);},this.setViewport=function(I,V,tt,j){I.isVector4?xt.set(I.x,I.y,I.z,I.w):xt.set(I,V,tt,j),P.viewport(X.copy(xt).multiplyScalar(nt).round());},this.getScissor=function(I){return I.copy(yt);},this.setScissor=function(I,V,tt,j){I.isVector4?yt.set(I.x,I.y,I.z,I.w):yt.set(I,V,tt,j),P.scissor(vt.copy(yt).multiplyScalar(nt).round());},this.getScissorTest=function(){return fe;},this.setScissorTest=function(I){P.setScissorTest(fe=I);},this.setOpaqueSort=function(I){mt=I;},this.setTransparentSort=function(I){Y=I;},this.getClearColor=function(I){return I.copy(we.getClearColor());},this.setClearColor=function(){we.setClearColor(...arguments);},this.getClearAlpha=function(){return we.getClearAlpha();},this.setClearAlpha=function(){we.setClearAlpha(...arguments);},this.clear=function(I=!0,V=!0,tt=!0){let j=0;if(I){let K=!1;if(G!==null){const Nt=G.texture.format;K=g.has(Nt);}if(K){const Nt=G.texture.type,Yt=x.has(Nt),Ft=we.getClearColor(),Kt=we.getClearAlpha(),ie=Ft.r,Se=Ft.g,Ee=Ft.b;Yt?(m[0]=ie,m[1]=Se,m[2]=Ee,m[3]=Kt,O.clearBufferuiv(O.COLOR,0,m)):(w[0]=ie,w[1]=Se,w[2]=Ee,w[3]=Kt,O.clearBufferiv(O.COLOR,0,w));}else j|=O.COLOR_BUFFER_BIT;}V&&(j|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),tt&&(j|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),j!==0&&O.clear(j);},this.clearColor=function(){this.clear(!0,!1,!1);},this.clearDepth=function(){this.clear(!1,!0,!1);},this.clearStencil=function(){this.clear(!1,!1,!0);},this.setNodesHandler=function(I){I.setRenderer(this),R=I;},this.dispose=function(){e.removeEventListener("webglcontextlost",je,!1),e.removeEventListener("webglcontextrestored",Oe,!1),e.removeEventListener("webglcontextcreationerror",qs,!1),we.dispose(),Dt.dispose(),Et.dispose(),Z.dispose(),_t.dispose(),lt.dispose(),Ot.dispose(),pt.dispose(),Tt.dispose(),ee.dispose(),ee.removeEventListener("sessionstart",Wp),ee.removeEventListener("sessionend",qp),Oo.stop();};function je(I){I.preventDefault(),Threelog("WebGLRenderer: Context Lost."),T=!0;}function Oe(){Threelog("WebGLRenderer: Context Restored."),T=!1;const I=W.autoReset,V=ue.enabled,tt=ue.autoUpdate,j=ue.needsUpdate,K=ue.type;re(),W.autoReset=I,ue.enabled=V,ue.autoUpdate=tt,ue.needsUpdate=j,ue.type=K;}function qs(I){Threeerror("WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage);}function yn(I){const V=I.target;V.removeEventListener("dispose",yn),pw(V);}function pw(I){mw(I),Z.remove(I);}function mw(I){const V=Z.get(I).programs;V!==void 0&&(V.forEach(function(tt){Tt.releaseProgram(tt);}),I.isShaderMaterial&&Tt.releaseShaderCache(I));}this.renderBufferDirect=function(I,V,tt,j,K,Nt){V===null&&(V=Ht);const Yt=K.isMesh&&K.matrixWorld.determinantAffine()<0,Ft=xw(I,V,tt,j,K);P.setMaterial(j,Yt);let Kt=tt.index,ie=1;if(j.wireframe===!0){if(Kt=ot.getWireframeAttribute(tt),Kt===void 0)return;ie=2;}const Se=tt.drawRange,Ee=tt.attributes.position;let Jt=Se.start*ie,Be=(Se.start+Se.count)*ie;Nt!==null&&(Jt=Math.max(Jt,Nt.start*ie),Be=Math.min(Be,(Nt.start+Nt.count)*ie)),Kt!==null?(Jt=Math.max(Jt,0),Be=Math.min(Be,Kt.count)):Ee!=null&&(Jt=Math.max(Jt,0),Be=Math.min(Be,Ee.count));const vi=Be-Jt;if(vi<0||vi===1/0)return;Ot.setup(K,j,Ft,tt,Kt);let ti,Ze=Ct;if(Kt!==null&&(ti=bt.get(Kt),Ze=ct,Ze.setIndex(ti)),K.isMesh)j.wireframe===!0?(P.setLineWidth(j.wireframeLinewidth*ce()),Ze.setMode(O.LINES)):Ze.setMode(O.TRIANGLES);else if(K.isLine){let qi=j.linewidth;qi===void 0&&(qi=1),P.setLineWidth(qi*ce()),K.isLineSegments?Ze.setMode(O.LINES):K.isLineLoop?Ze.setMode(O.LINE_LOOP):Ze.setMode(O.LINE_STRIP);}else K.isPoints?Ze.setMode(O.POINTS):K.isSprite&&Ze.setMode(O.TRIANGLES);if(K.isBatchedMesh){if(de.get("WEBGL_multi_draw"))Ze.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{const qi=K._multiDrawStarts,Xt=K._multiDrawCounts,ts=K._multiDrawCount,Pe=Kt?bt.get(Kt).bytesPerElement:1,Ls=Z.get(j).currentProgram.getUniforms();for(let wn=0;wn<ts;wn++)Ls.setValue(O,"_gl_DrawID",wn),Ze.render(qi[wn]/Pe,Xt[wn]);}}else if(K.isInstancedMesh)Ze.renderInstances(Jt,vi,K.count);else if(tt.isInstancedBufferGeometry){const qi=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,Xt=Math.min(tt.instanceCount,qi);Ze.renderInstances(Jt,vi,Xt);}else Ze.render(Jt,vi);};function Hp(I,V,tt,j){R!==null&&I.isNodeMaterial&&R.setObject(j,I),ut===!0&&oe.setState(I,tt,!1),I.transparent===!0&&I.side===ThreeDoubleSide&&I.forceSinglePass===!1?(I.side=ThreeBackSide,I.needsUpdate=!0,yc(I,V,j),I.side=ThreeFrontSide,I.needsUpdate=!0,yc(I,V,j),I.side=ThreeDoubleSide):yc(I,V,j);}this.compile=function(I,V,tt=null){tt===null&&(tt=I),R!==null&&R.renderStart(I,V,tt),M=Et.get(tt),M.init(V),b.push(M),tt.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(M.pushLight(K),K.castShadow&&M.pushShadow(K));}),I!==tt&&I.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(M.pushLight(K),K.castShadow&&M.pushShadow(K));}),M.setupLights(),R!==null&&R.updateLights(M.state.lightsArray),dt=this.localClippingEnabled,ut=oe.init(this.clippingPlanes,dt),ut===!0&&oe.setGlobalState(this.clippingPlanes,V),R!==null&&ue.render(M.state.shadowsArray,tt,V);const j=new Set();return I.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;const Nt=K.material;if(Nt)if(Array.isArray(Nt))for(let Yt=0;Yt<Nt.length;Yt++){const Ft=Nt[Yt];Hp(Ft,tt,V,K),j.add(Ft);}else Hp(Nt,tt,V,K),j.add(Nt);}),M=b.pop(),R!==null&&R.renderEnd(),j;},this.compileAsync=function(I,V,tt=null){const j=this.compile(I,V,tt);return new Promise(K=>{function Nt(){if(j.forEach(function(Yt){const Kt=Z.get(Yt).currentProgram;(Kt===void 0||Kt.isReady())&&j.delete(Yt);}),j.size===0){K(I);return;}setTimeout(Nt,10);}de.get("KHR_parallel_shader_compile")!==null?Nt():setTimeout(Nt,10);});};let Fu=null;function gw(I){Fu&&Fu(I);}function Wp(){Oo.stop();}function qp(){Oo.start();}const Oo=new wy();Oo.setAnimationLoop(gw),typeof self<"u"&&Oo.setContext(self),this.setAnimationLoop=function(I){Fu=I,ee.setAnimationLoop(I),I===null?Oo.stop():Oo.start();},ee.addEventListener("sessionstart",Wp),ee.addEventListener("sessionend",qp),this.render=function(I,V){if(V!==void 0&&V.isCamera!==!0){Threeerror("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return;}if(T===!0)return;R!==null&&R.renderStart(I,V);const tt=ee.enabled===!0&&ee.isPresenting===!0,j=S!==null&&(G===null||tt)&&S.begin(E,G);if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),ee.enabled===!0&&ee.isPresenting===!0&&(S===null||S.isCompositing()===!1)&&(ee.cameraAutoUpdate===!0&&ee.updateCamera(V),V=ee.getCamera()),I.isScene===!0&&I.onBeforeRender(E,I,V,G),M=Et.get(I,b.length),M.init(V),M.state.textureUnits=st.getTextureUnits(),b.push(M),ft.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),et.setFromProjectionMatrix(ft,ThreeWebGLCoordinateSystem,V.reversedDepth),dt=this.localClippingEnabled,ut=oe.init(this.clippingPlanes,dt),_=Dt.get(I,A.length),_.init(),A.push(_),ee.enabled===!0&&ee.isPresenting===!0){const Yt=E.xr.getDepthSensingMesh();Yt!==null&&Nu(Yt,V,-1/0,E.sortObjects);}Nu(I,V,0,E.sortObjects),_.finish(),R!==null&&R.updateLights(M.state.lightsArray),E.sortObjects===!0&&_.sort(mt,Y),qt=ee.enabled===!1||ee.isPresenting===!1||ee.hasDepthSensing()===!1,qt&&we.addToRenderList(_,I),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ut===!0&&oe.beginShadows();const K=M.state.shadowsArray;if(ue.render(K,I,V),ut===!0&&oe.endShadows(),(j&&S.hasRenderPass())===!1){const Yt=_.opaque,Ft=_.transmissive;if(M.setupLights(),V.isArrayCamera){const Kt=V.cameras;if(Ft.length>0)for(let ie=0,Se=Kt.length;ie<Se;ie++){const Ee=Kt[ie];Yp(Yt,Ft,I,Ee);}qt&&we.render(I);for(let ie=0,Se=Kt.length;ie<Se;ie++){const Ee=Kt[ie];Xp(_,I,Ee,Ee.viewport);}}else Ft.length>0&&Yp(Yt,Ft,I,V),qt&&we.render(I),Xp(_,I,V);}G!==null&&F===0&&(st.updateMultisampleRenderTarget(G),st.updateRenderTargetMipmap(G)),j&&S.end(E),I.isScene===!0&&I.onAfterRender(E,I,V),Ot.resetDefaultState(),B=-1,q=null,b.pop(),b.length>0?(M=b[b.length-1],st.setTextureUnits(M.state.textureUnits),ut===!0&&oe.setGlobalState(E.clippingPlanes,M.state.camera)):M=null,A.pop(),A.length>0?_=A[A.length-1]:_=null,R!==null&&R.renderEnd();};function Nu(I,V,tt,j){if(I.visible===!1)return;if(I.layers.test(V.layers)){if(I.isGroup)tt=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(V);else if(I.isLightProbeGrid)M.pushLightProbeGrid(I);else if(I.isLight)M.pushLight(I),I.castShadow&&M.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||I.intersectsFrustum(et)){j&&Wt.setFromMatrixPosition(I.matrixWorld).applyMatrix4(ft);const Yt=lt.update(I),Ft=I.material;Ft.visible&&_.push(I,Yt,Ft,tt,Wt.z,null,V);}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||I.intersectsFrustum(et))){const Yt=lt.update(I),Ft=I.material;if(j&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),Wt.copy(I.boundingSphere.center)):(Yt.boundingSphere===null&&Yt.computeBoundingSphere(),Wt.copy(Yt.boundingSphere.center)),Wt.applyMatrix4(I.matrixWorld).applyMatrix4(ft)),Array.isArray(Ft)){const Kt=Yt.groups;for(let ie=0,Se=Kt.length;ie<Se;ie++){const Ee=Kt[ie],Jt=Ft[Ee.materialIndex];Jt&&Jt.visible&&_.push(I,Yt,Jt,tt,Wt.z,Ee,V);}}else Ft.visible&&_.push(I,Yt,Ft,tt,Wt.z,null,V);}}const Nt=I.children;for(let Yt=0,Ft=Nt.length;Yt<Ft;Yt++)Nu(Nt[Yt],V,tt,j);}function Xp(I,V,tt,j){const{opaque:K,transmissive:Nt,transparent:Yt}=I;M.setupLightsView(tt),ut===!0&&oe.setGlobalState(E.clippingPlanes,tt),j&&P.viewport(X.copy(j)),K.length>0&&xc(K,V,tt),Nt.length>0&&xc(Nt,V,tt),Yt.length>0&&xc(Yt,V,tt),P.buffers.depth.setTest(!0),P.buffers.depth.setMask(!0),P.buffers.color.setMask(!0),P.setPolygonOffset(!1);}function Yp(I,V,tt,j){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[j.id]===void 0){const Jt=de.has("EXT_color_buffer_half_float")||de.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[j.id]=new ThreeWebGLRenderTarget(1,1,{generateMipmaps:!0,type:Jt?ThreeHalfFloatType:ThreeUnsignedByteType,minFilter:ThreeLinearMipmapLinearFilter,samples:Math.max(4,D.samples),stencilBuffer:n,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ThreeColorManagement.workingColorSpace});}const Nt=M.state.transmissionRenderTarget[j.id],Yt=j.viewport||X;Nt.setSize(Yt.z*E.transmissionResolutionScale,Yt.w*E.transmissionResolutionScale);const Ft=E.getRenderTarget(),Kt=E.getActiveCubeFace(),ie=E.getActiveMipmapLevel();E.setRenderTarget(Nt),E.getClearColor(Qt),te=E.getClearAlpha(),te<1&&E.setClearColor(16777215,.5),E.clear(),qt&&we.render(tt);const Se=E.toneMapping;E.toneMapping=ThreeNoToneMapping;const Ee=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),M.setupLightsView(j),ut===!0&&oe.setGlobalState(E.clippingPlanes,j),xc(I,tt,j),st.updateMultisampleRenderTarget(Nt),st.updateRenderTargetMipmap(Nt),de.has("WEBGL_multisampled_render_to_texture")===!1){let Jt=!1;for(let Be=0,vi=V.length;Be<vi;Be++){const ti=V[Be],{object:Ze,geometry:qi,material:Xt,group:ts}=ti;if(Xt.side===ThreeDoubleSide&&Ze.layers.test(j.layers)){const Pe=Xt.side;Xt.side=ThreeBackSide,Xt.needsUpdate=!0,$p(Ze,tt,j,qi,Xt,ts),Xt.side=Pe,Xt.needsUpdate=!0,Jt=!0;}}Jt===!0&&(st.updateMultisampleRenderTarget(Nt),st.updateRenderTargetMipmap(Nt));}E.setRenderTarget(Ft,Kt,ie),E.setClearColor(Qt,te),Ee!==void 0&&(j.viewport=Ee),E.toneMapping=Se;}function xc(I,V,tt){const j=V.isScene===!0?V.overrideMaterial:null;for(let K=0,Nt=I.length;K<Nt;K++){const Yt=I[K],{object:Ft,geometry:Kt,group:ie}=Yt;let Se=Yt.material;Se.allowOverride===!0&&j!==null&&(Se=j),Ft.layers.test(tt.layers)&&$p(Ft,V,tt,Kt,Se,ie);}}function $p(I,V,tt,j,K,Nt){R!==null&&K.isNodeMaterial&&R.setObject(I,K),I.onBeforeRender(E,V,tt,j,K,Nt),I.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),K.onBeforeRender(E,V,tt,j,I,Nt),K.transparent===!0&&K.side===ThreeDoubleSide&&K.forceSinglePass===!1?(K.side=ThreeBackSide,K.needsUpdate=!0,E.renderBufferDirect(tt,V,j,K,I,Nt),K.side=ThreeFrontSide,K.needsUpdate=!0,E.renderBufferDirect(tt,V,j,K,I,Nt),K.side=ThreeDoubleSide):E.renderBufferDirect(tt,V,j,K,I,Nt),I.onAfterRender(E,V,tt,j,K,Nt);}function yc(I,V,tt){V.isScene!==!0&&(V=Ht);const j=Z.get(I),K=M.state.lights,Nt=M.state.shadowsArray,Yt=K.state.version,Ft=Tt.getParameters(I,K.state,Nt,V,tt,M.state.lightProbeGridArray),Kt=Tt.getProgramCacheKey(Ft);let ie=j.programs;j.environment=I.isMeshStandardMaterial||I.isMeshLambertMaterial||I.isMeshPhongMaterial?V.environment:null,j.fog=V.fog;const Se=I.isMeshStandardMaterial||I.isMeshLambertMaterial&&!I.envMap||I.isMeshPhongMaterial&&!I.envMap;j.envMap=_t.get(I.envMap||j.environment,Se),j.envMapRotation=j.environment!==null&&I.envMap===null?V.environmentRotation:I.envMapRotation,ie===void 0&&(I.addEventListener("dispose",yn),ie=new Map(),j.programs=ie);let Ee=ie.get(Kt);if(Ee!==void 0){if(j.currentProgram===Ee&&j.lightsStateVersion===Yt)return jp(I,Ft),Ee;}else Ft.uniforms=Tt.getUniforms(I),R!==null&&I.isNodeMaterial&&R.build(I,tt,Ft),I.onBeforeCompile(Ft,E),Ee=Tt.acquireProgram(Ft,Kt),ie.set(Kt,Ee),j.uniforms=Ft.uniforms;const Jt=j.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(Jt.clippingPlanes=oe.uniform),jp(I,Ft),j.needsLights=ww(I),j.lightsStateVersion=Yt,j.needsLights&&(Jt.ambientLightColor.value=K.state.ambient,Jt.lightProbe.value=K.state.probe,Jt.sunLights.value=K.state.sun,Jt.sunLightShadows.value=K.state.sunShadow,Jt.directionalLights.value=K.state.directional,Jt.directionalLightShadows.value=K.state.directionalShadow,Jt.spotLights.value=K.state.spot,Jt.spotLightShadows.value=K.state.spotShadow,Jt.rectAreaLights.value=K.state.rectArea,Jt.ltc_1.value=K.state.rectAreaLTC1,Jt.ltc_2.value=K.state.rectAreaLTC2,Jt.pointLights.value=K.state.point,Jt.pointLightShadows.value=K.state.pointShadow,Jt.hemisphereLights.value=K.state.hemi,Jt.sunShadowMatrix.value=K.state.sunShadowMatrix,Jt.sunShadowCascade.value=K.state.sunShadowCascade,Jt.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Jt.spotLightMatrix.value=K.state.spotLightMatrix,Jt.spotLightMap.value=K.state.spotLightMap,Jt.pointShadowMatrix.value=K.state.pointShadowMatrix),j.lightProbeGrid=M.state.lightProbeGridArray.length>0,j.currentProgram=Ee,j.uniformsList=null,Ee;}function Zp(I){if(I.uniformsList===null){const V=I.currentProgram.getUniforms();I.uniformsList=Vh.seqWithValue(V.seq,I.uniforms);}return I.uniformsList;}function jp(I,V){const tt=Z.get(I);tt.outputColorSpace=V.outputColorSpace,tt.batching=V.batching,tt.batchingColor=V.batchingColor,tt.instancing=V.instancing,tt.instancingColor=V.instancingColor,tt.instancingMorph=V.instancingMorph,tt.skinning=V.skinning,tt.morphTargets=V.morphTargets,tt.morphNormals=V.morphNormals,tt.morphColors=V.morphColors,tt.morphTargetsCount=V.morphTargetsCount,tt.numClippingPlanes=V.numClippingPlanes,tt.numIntersection=V.numClipIntersection,tt.vertexAlphas=V.vertexAlphas,tt.vertexTangents=V.vertexTangents,tt.toneMapping=V.toneMapping;}function vw(I,V){if(I.length===0)return null;if(I.length===1)return I[0].texture!==null?I[0]:null;y.setFromMatrixPosition(V.matrixWorld);for(let tt=0,j=I.length;tt<j;tt++){const K=I[tt];if(K.texture!==null&&K.boundingBox.containsPoint(y))return K;}return null;}function xw(I,V,tt,j,K){V.isScene!==!0&&(V=Ht),st.resetTextureUnits();const Nt=V.fog,Yt=j.isMeshStandardMaterial||j.isMeshLambertMaterial||j.isMeshPhongMaterial?V.environment:null,Ft=G===null?E.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:ThreeColorManagement.workingColorSpace,Kt=j.isMeshStandardMaterial||j.isMeshLambertMaterial&&!j.envMap||j.isMeshPhongMaterial&&!j.envMap,ie=_t.get(j.envMap||Yt,Kt),Se=j.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Ee=!!tt.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Jt=!!tt.morphAttributes.position,Be=!!tt.morphAttributes.normal,vi=!!tt.morphAttributes.color;let ti=ThreeNoToneMapping;j.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(ti=E.toneMapping);const Ze=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,qi=Ze!==void 0?Ze.length:0,Xt=Z.get(j),ts=M.state.lights;if(ut===!0&&(dt===!0||I!==q)){const Ke=I===q&&j.id===B;oe.setState(j,I,Ke);}let Pe=!1;j.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==ts.state.version||Xt.outputColorSpace!==Ft||K.isBatchedMesh&&Xt.batching===!1||!K.isBatchedMesh&&Xt.batching===!0||K.isBatchedMesh&&Xt.batchingColor===!0&&K._colorsTexture===null||K.isBatchedMesh&&Xt.batchingColor===!1&&K._colorsTexture!==null||K.isInstancedMesh&&Xt.instancing===!1||!K.isInstancedMesh&&Xt.instancing===!0||K.isSkinnedMesh&&Xt.skinning===!1||!K.isSkinnedMesh&&Xt.skinning===!0||K.isInstancedMesh&&Xt.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Xt.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&Xt.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&Xt.instancingMorph===!1&&K.morphTexture!==null||Xt.envMap!==ie||j.fog===!0&&Xt.fog!==Nt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==oe.numPlanes||Xt.numIntersection!==oe.numIntersection)||Xt.vertexAlphas!==Se||Xt.vertexTangents!==Ee||Xt.morphTargets!==Jt||Xt.morphNormals!==Be||Xt.morphColors!==vi||Xt.toneMapping!==ti||Xt.morphTargetsCount!==qi||!!Xt.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(Pe=!0):(Pe=!0,Xt.__version=j.version);let Ls=Xt.currentProgram;Pe===!0&&(Ls=yc(j,V,K),R&&j.isNodeMaterial&&R.onUpdateProgram(j,Ls,Xt));let wn=!1,ho=!1,Lr=!1;const Ye=Ls.getUniforms(),pi=Xt.uniforms;if(P.useProgram(Ls.program)&&(wn=!0,ho=!0,Lr=!0),j.id!==B&&(B=j.id,ho=!0),Xt.needsLights){const Ke=vw(M.state.lightProbeGridArray,K);Xt.lightProbeGrid!==Ke&&(Xt.lightProbeGrid=Ke,ho=!0);}if(wn||q!==I){P.buffers.depth.getReversed()&&I.reversedDepth!==!0&&(I._reversedDepth=!0,I.updateProjectionMatrix()),Ye.setValue(O,"projectionMatrix",I.projectionMatrix),Ye.setValue(O,"viewMatrix",I.matrixWorldInverse);const fo=Ye.map.cameraPosition;fo!==void 0&&fo.setValue(O,wt.setFromMatrixPosition(I.matrixWorld)),D.logarithmicDepthBuffer&&Ye.setValue(O,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Ye.setValue(O,"isOrthographic",I.isOrthographicCamera===!0),q!==I&&(q=I,ho=!0,Lr=!0);}if(Xt.needsLights&&(ts.state.sunShadowMap.length>0&&Ye.setValue(O,"sunShadowMap",ts.state.sunShadowMap,st),ts.state.directionalShadowMap.length>0&&Ye.setValue(O,"directionalShadowMap",ts.state.directionalShadowMap,st),ts.state.spotShadowMap.length>0&&Ye.setValue(O,"spotShadowMap",ts.state.spotShadowMap,st),ts.state.pointShadowMap.length>0&&Ye.setValue(O,"pointShadowMap",ts.state.pointShadowMap,st)),K.isSkinnedMesh){Ye.setOptional(O,K,"bindMatrix"),Ye.setOptional(O,K,"bindMatrixInverse");const Ke=K.skeleton;Ke&&(Ke.boneTexture===null&&Ke.computeBoneTexture(),Ye.setValue(O,"boneTexture",Ke.boneTexture,st));}K.isBatchedMesh&&(Ye.setOptional(O,K,"batchingTexture"),Ye.setValue(O,"batchingTexture",K._matricesTexture,st),Ye.setOptional(O,K,"batchingIdTexture"),Ye.setValue(O,"batchingIdTexture",K._indirectTexture,st),Ye.setOptional(O,K,"batchingColorTexture"),K._colorsTexture!==null&&Ye.setValue(O,"batchingColorTexture",K._colorsTexture,st));const uo=tt.morphAttributes;if((uo.position!==void 0||uo.normal!==void 0||uo.color!==void 0)&&H.update(K,tt,Ls),(ho||Xt.receiveShadow!==K.receiveShadow)&&(Xt.receiveShadow=K.receiveShadow,Ye.setValue(O,"receiveShadow",K.receiveShadow)),(j.isMeshStandardMaterial||j.isMeshLambertMaterial||j.isMeshPhongMaterial)&&j.envMap===null&&V.environment!==null&&(pi.envMapIntensity.value=V.environmentIntensity),pi.dfgLUT!==void 0&&(pi.dfgLUT.value=fT()),ho){if(Ye.setValue(O,"toneMappingExposure",E.toneMappingExposure),Xt.needsLights&&yw(pi,Lr),Nt&&j.fog===!0&&ne.refreshFogUniforms(pi,Nt),ne.refreshMaterialUniforms(pi,j,nt,J,M.state.transmissionRenderTarget[I.id]),Xt.needsLights&&Xt.lightProbeGrid){const Ke=Xt.lightProbeGrid;pi.probesSH.value=Ke.texture,pi.probesMin.value.copy(Ke.boundingBox.min),pi.probesMax.value.copy(Ke.boundingBox.max),pi.probesResolution.value.copy(Ke.resolution);}Vh.upload(O,Zp(Xt),pi,st);}if(j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Vh.upload(O,Zp(Xt),pi,st),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Ye.setValue(O,"center",K.center),Ye.setValue(O,"modelViewMatrix",K.modelViewMatrix),Ye.setValue(O,"normalMatrix",K.normalMatrix),Ye.setValue(O,"modelMatrix",K.matrixWorld),j.uniformsGroups!==void 0){const Ke=j.uniformsGroups;for(let fo=0,Ir=Ke.length;fo<Ir;fo++){const Jp=Ke[fo];pt.update(Jp,Ls),pt.bind(Jp,Ls);}}return Ls;}function yw(I,V){I.ambientLightColor.needsUpdate=V,I.lightProbe.needsUpdate=V,I.sunLights.needsUpdate=V,I.sunLightShadows.needsUpdate=V,I.directionalLights.needsUpdate=V,I.directionalLightShadows.needsUpdate=V,I.pointLights.needsUpdate=V,I.pointLightShadows.needsUpdate=V,I.spotLights.needsUpdate=V,I.spotLightShadows.needsUpdate=V,I.rectAreaLights.needsUpdate=V,I.hemisphereLights.needsUpdate=V;}function ww(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0;}this.getActiveCubeFace=function(){return U;},this.getActiveMipmapLevel=function(){return F;},this.getRenderTarget=function(){return G;},this.setRenderTargetTextures=function(I,V,tt){const j=Z.get(I);j.__autoAllocateDepthBuffer=I.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),Z.get(I.texture).__webglTexture=V,Z.get(I.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:tt,j.__hasExternalTextures=!0;},this.setRenderTargetFramebuffer=function(I,V){const tt=Z.get(I);tt.__webglFramebuffer=V,tt.__useDefaultFramebuffer=V===void 0;},this.setRenderTarget=function(I,V=0,tt=0){G=I,U=V,F=tt;let j=null,K=!1,Nt=!1;if(I){const Ft=Z.get(I);if(Ft.__useDefaultFramebuffer!==void 0){P.bindFramebuffer(O.FRAMEBUFFER,Ft.__webglFramebuffer),X.copy(I.viewport),vt.copy(I.scissor),gt=I.scissorTest,P.viewport(X),P.scissor(vt),P.setScissorTest(gt),B=-1;return;}else if(Ft.__webglFramebuffer===void 0)st.setupRenderTarget(I);else if(Ft.__hasExternalTextures)st.rebindTextures(I,Z.get(I.texture).__webglTexture,Z.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){const Se=I.depthTexture;if(Ft.__boundDepthTexture!==Se){if(Se!==null&&Z.has(Se)&&(I.width!==Se.image.width||I.height!==Se.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");st.setupDepthRenderbuffer(I);}}const Kt=I.texture;(Kt.isData3DTexture||Kt.isDataArrayTexture||Kt.isCompressedArrayTexture)&&(Nt=!0);const ie=Z.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(ie[V])?j=ie[V][tt]:j=ie[V],K=!0):I.samples>0&&st.useMultisampledRTT(I)===!1?j=Z.get(I).__webglMultisampledFramebuffer:Array.isArray(ie)?j=ie[tt]:j=ie,X.copy(I.viewport),vt.copy(I.scissor),gt=I.scissorTest;}else X.copy(xt).multiplyScalar(nt).floor(),vt.copy(yt).multiplyScalar(nt).floor(),gt=fe;if(tt!==0&&(j=z),P.bindFramebuffer(O.FRAMEBUFFER,j)&&P.drawBuffers(I,j),P.viewport(X),P.scissor(vt),P.setScissorTest(gt),K){const Ft=Z.get(I.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+V,Ft.__webglTexture,tt);}else if(Nt){const Ft=V;for(let Kt=0;Kt<I.textures.length;Kt++){const ie=Z.get(I.textures[Kt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Kt,ie.__webglTexture,tt,Ft);}}else if(I!==null&&tt!==0){const Ft=Z.get(I.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ft.__webglTexture,tt);}B=-1;};function Kp(I){const V=Z.get(I);return(V.__readFormat!==I.format||V.__readType!==I.type)&&(V.__readFormat=I.format,V.__readType=I.type,V.__formatReadable=D.textureFormatReadable(I.format),V.__typeReadable=D.textureTypeReadable(I.type)),V;}this.readRenderTargetPixels=function(I,V,tt,j,K,Nt,Yt,Ft=0){if(!(I&&I.isWebGLRenderTarget)){Threeerror("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return;}let Kt=Z.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Yt!==void 0&&(Kt=Kt[Yt]),Kt){P.bindFramebuffer(O.FRAMEBUFFER,Kt);try{const ie=I.textures[Ft],Se=ie.format,Ee=ie.type;I.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ft);const Jt=Kp(ie);if(Jt.__formatReadable===!1){Threeerror("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return;}if(Jt.__typeReadable===!1){Threeerror("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return;}V>=0&&V<=I.width-j&&tt>=0&&tt<=I.height-K&&O.readPixels(V,tt,j,K,Rt.convert(Se),Rt.convert(Ee),Nt);}finally{const ie=G!==null?Z.get(G).__webglFramebuffer:null;P.bindFramebuffer(O.FRAMEBUFFER,ie);}}},this.readRenderTargetPixelsAsync=async function(I,V,tt,j,K,Nt,Yt,Ft=0){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Kt=Z.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Yt!==void 0&&(Kt=Kt[Yt]),Kt)if(V>=0&&V<=I.width-j&&tt>=0&&tt<=I.height-K){P.bindFramebuffer(O.FRAMEBUFFER,Kt);const ie=I.textures[Ft],Se=ie.format,Ee=ie.type;I.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ft);const Jt=Kp(ie);if(Jt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Jt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Be=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Be),O.bufferData(O.PIXEL_PACK_BUFFER,Nt.byteLength,O.STREAM_READ),O.readPixels(V,tt,j,K,Rt.convert(Se),Rt.convert(Ee),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const vi=G!==null?Z.get(G).__webglFramebuffer:null;P.bindFramebuffer(O.FRAMEBUFFER,vi);const ti=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await g_(O,ti,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Be),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Nt),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(Be),O.deleteSync(ti),Nt;}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");},this.copyFramebufferToTexture=function(I,V=null,tt=0){const j=Math.pow(2,-tt),K=Math.floor(I.image.width*j),Nt=Math.floor(I.image.height*j),Yt=V!==null?V.x:0,Ft=V!==null?V.y:0;st.setTexture2D(I,0),O.copyTexSubImage2D(O.TEXTURE_2D,tt,0,0,Yt,Ft,K,Nt),P.unbindTexture();},this.copyTextureToTexture=function(I,V,tt=null,j=null,K=0,Nt=0){let Yt,Ft,Kt,ie,Se,Ee,Jt,Be,vi;const ti=I.isCompressedTexture?I.mipmaps[Nt]:I.image;if(tt!==null)Yt=tt.max.x-tt.min.x,Ft=tt.max.y-tt.min.y,Kt=tt.isBox3?tt.max.z-tt.min.z:1,ie=tt.min.x,Se=tt.min.y,Ee=tt.isBox3?tt.min.z:0;else{const pi=Math.pow(2,-K);Yt=Math.floor(ti.width*pi),Ft=Math.floor(ti.height*pi),I.isDataArrayTexture?Kt=ti.depth:I.isData3DTexture?Kt=Math.floor(ti.depth*pi):Kt=1,ie=0,Se=0,Ee=0;}j!==null?(Jt=j.x,Be=j.y,vi=j.z):(Jt=0,Be=0,vi=0);const Ze=Rt.convert(V.format),qi=Rt.convert(V.type);let Xt;V.isData3DTexture?(st.setTexture3D(V,0),Xt=O.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(st.setTexture2DArray(V,0),Xt=O.TEXTURE_2D_ARRAY):(st.setTexture2D(V,0),Xt=O.TEXTURE_2D),P.activeTexture(O.TEXTURE0),P.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,V.flipY),P.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),P.pixelStorei(O.UNPACK_ALIGNMENT,V.unpackAlignment);const ts=P.getParameter(O.UNPACK_ROW_LENGTH),Pe=P.getParameter(O.UNPACK_IMAGE_HEIGHT),Ls=P.getParameter(O.UNPACK_SKIP_PIXELS),wn=P.getParameter(O.UNPACK_SKIP_ROWS),ho=P.getParameter(O.UNPACK_SKIP_IMAGES);P.pixelStorei(O.UNPACK_ROW_LENGTH,ti.width),P.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ti.height),P.pixelStorei(O.UNPACK_SKIP_PIXELS,ie),P.pixelStorei(O.UNPACK_SKIP_ROWS,Se),P.pixelStorei(O.UNPACK_SKIP_IMAGES,Ee);const Lr=I.isDataArrayTexture||I.isData3DTexture,Ye=V.isDataArrayTexture||V.isData3DTexture;if(I.isDepthTexture){const pi=Z.get(I),uo=Z.get(V),Ke=Z.get(pi.__renderTarget),fo=Z.get(uo.__renderTarget);P.bindFramebuffer(O.READ_FRAMEBUFFER,Ke.__webglFramebuffer),P.bindFramebuffer(O.DRAW_FRAMEBUFFER,fo.__webglFramebuffer);for(let Ir=0;Ir<Kt;Ir++)Lr&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Z.get(I).__webglTexture,K,Ee+Ir),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Z.get(V).__webglTexture,Nt,vi+Ir)),O.blitFramebuffer(ie,Se,Yt,Ft,Jt,Be,Yt,Ft,O.DEPTH_BUFFER_BIT,O.NEAREST);P.bindFramebuffer(O.READ_FRAMEBUFFER,null),P.bindFramebuffer(O.DRAW_FRAMEBUFFER,null);}else if(K!==0||I.isRenderTargetTexture||Z.has(I)){const pi=Z.get(I),uo=Z.get(V);P.bindFramebuffer(O.READ_FRAMEBUFFER,L),P.bindFramebuffer(O.DRAW_FRAMEBUFFER,k);for(let Ke=0;Ke<Kt;Ke++)Lr?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,pi.__webglTexture,K,Ee+Ke):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,pi.__webglTexture,K),Ye?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,uo.__webglTexture,Nt,vi+Ke):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,uo.__webglTexture,Nt),K!==0?O.blitFramebuffer(ie,Se,Yt,Ft,Jt,Be,Yt,Ft,O.COLOR_BUFFER_BIT,O.NEAREST):Ye?O.copyTexSubImage3D(Xt,Nt,Jt,Be,vi+Ke,ie,Se,Yt,Ft):O.copyTexSubImage2D(Xt,Nt,Jt,Be,ie,Se,Yt,Ft);P.bindFramebuffer(O.READ_FRAMEBUFFER,null),P.bindFramebuffer(O.DRAW_FRAMEBUFFER,null);}else Ye?I.isDataTexture||I.isData3DTexture?O.texSubImage3D(Xt,Nt,Jt,Be,vi,Yt,Ft,Kt,Ze,qi,ti.data):V.isCompressedArrayTexture?O.compressedTexSubImage3D(Xt,Nt,Jt,Be,vi,Yt,Ft,Kt,Ze,ti.data):O.texSubImage3D(Xt,Nt,Jt,Be,vi,Yt,Ft,Kt,Ze,qi,ti):I.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Nt,Jt,Be,Yt,Ft,Ze,qi,ti.data):I.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Nt,Jt,Be,ti.width,ti.height,Ze,ti.data):O.texSubImage2D(O.TEXTURE_2D,Nt,Jt,Be,Yt,Ft,Ze,qi,ti);P.pixelStorei(O.UNPACK_ROW_LENGTH,ts),P.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Pe),P.pixelStorei(O.UNPACK_SKIP_PIXELS,Ls),P.pixelStorei(O.UNPACK_SKIP_ROWS,wn),P.pixelStorei(O.UNPACK_SKIP_IMAGES,ho),Nt===0&&V.generateMipmaps&&O.generateMipmap(Xt),P.unbindTexture();},this.initRenderTarget=function(I){Z.get(I).__webglFramebuffer===void 0&&st.setupRenderTarget(I);},this.initTexture=function(I){I.isCubeTexture?st.setTextureCube(I,0):I.isData3DTexture?st.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?st.setTexture2DArray(I,0):st.setTexture2D(I,0),P.unbindTexture();},this.resetState=function(){U=0,F=0,G=null,P.reset(),Ot.reset();},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}));}get coordinateSystem(){return ThreeWebGLCoordinateSystem;}get outputColorSpace(){return this._outputColorSpace;}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ThreeColorManagement._getDrawingBufferColorSpace(t),e.unpackColorSpace=ThreeColorManagement._getUnpackColorSpace();}}const Ry=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:ThreeACESFilmicToneMapping,AddEquation:ThreeAddEquation,AddOperation:ThreeAddOperation,AdditiveAnimationBlendMode:ThreeAdditiveAnimationBlendMode,AdditiveBlending:ThreeAdditiveBlending,AgXToneMapping:ThreeAgXToneMapping,AlphaFormat:ThreeAlphaFormat,AlwaysCompare:ThreeAlwaysCompare,AlwaysDepth:ThreeAlwaysDepth,AlwaysStencilFunc:ThreeAlwaysStencilFunc,AmbientLight:ThreeAmbientLight,AnimationAction:ThreeAnimationAction,AnimationClip:ThreeAnimationClip,AnimationLoader:ThreeAnimationLoader,AnimationMixer:ThreeAnimationMixer,AnimationObjectGroup:ThreeAnimationObjectGroup,AnimationUtils:ThreeAnimationUtils,ArcCurve:ThreeArcCurve,ArrayCamera:ThreeArrayCamera,ArrowHelper:ThreeArrowHelper,AttachedBindMode:ThreeAttachedBindMode,Audio:ThreeAudio,AudioAnalyser:ThreeAudioAnalyser,AudioContext:ThreeAudioContext,AudioListener:ThreeAudioListener,AudioLoader:ThreeAudioLoader,AxesHelper:ThreeAxesHelper,BackSide:ThreeBackSide,BasicDepthPacking:ThreeBasicDepthPacking,BasicShadowMap:ThreeBasicShadowMap,BatchedMesh:ThreeBatchedMesh,BezierInterpolant:ThreeBezierInterpolant,Bone:ThreeBone,BooleanKeyframeTrack:ThreeBooleanKeyframeTrack,Box2:ThreeBox2,Box3:ThreeBox3,Box3Helper:ThreeBox3Helper,BoxGeometry:ThreeBoxGeometry,BoxHelper:ThreeBoxHelper,BufferAttribute:ThreeBufferAttribute,BufferGeometry:ThreeBufferGeometry,BufferGeometryLoader:ThreeBufferGeometryLoader,ByteType:ThreeByteType,Cache:ThreeCache,Camera:ThreeCamera,CameraHelper:ThreeCameraHelper,CanvasTexture:ThreeCanvasTexture,CapsuleGeometry:ThreeCapsuleGeometry,CatmullRomCurve3:ThreeCatmullRomCurve3,CineonToneMapping:ThreeCineonToneMapping,CircleGeometry:ThreeCircleGeometry,ClampToEdgeWrapping:ThreeClampToEdgeWrapping,Clock:ThreeClock,Color:ThreeColor,ColorKeyframeTrack:ThreeColorKeyframeTrack,ColorManagement:ThreeColorManagement,Compatibility:ThreeCompatibility,CompressedArrayTexture:ThreeCompressedArrayTexture,CompressedCubeTexture:ThreeCompressedCubeTexture,CompressedTexture:ThreeCompressedTexture,CompressedTextureLoader:ThreeCompressedTextureLoader,ConeGeometry:ThreeConeGeometry,ConstantAlphaFactor:ThreeConstantAlphaFactor,ConstantColorFactor:ThreeConstantColorFactor,Controls:ThreeControls,CubeCamera:ThreeCubeCamera,CubeDepthTexture:ThreeCubeDepthTexture,CubeReflectionMapping:ThreeCubeReflectionMapping,CubeRefractionMapping:ThreeCubeRefractionMapping,CubeTexture:ThreeCubeTexture,CubeTextureLoader:ThreeCubeTextureLoader,CubeUVReflectionMapping:ThreeCubeUVReflectionMapping,CubicBezierCurve:ThreeCubicBezierCurve,CubicBezierCurve3:ThreeCubicBezierCurve3,CubicInterpolant:ThreeCubicInterpolant,CullFaceBack:ThreeCullFaceBack,CullFaceFront:ThreeCullFaceFront,CullFaceFrontBack:ThreeCullFaceFrontBack,CullFaceNone:ThreeCullFaceNone,Curve:ThreeCurve,CurvePath:ThreeCurvePath,CustomBlending:ThreeCustomBlending,CustomToneMapping:ThreeCustomToneMapping,CylinderGeometry:ThreeCylinderGeometry,Cylindrical:ThreeCylindrical,Data3DTexture:ThreeData3DTexture,DataArrayTexture:ThreeDataArrayTexture,DataTexture:ThreeDataTexture,DataTextureLoader:ThreeDataTextureLoader,DataUtils:ThreeDataUtils,DecrementStencilOp:ThreeDecrementStencilOp,DecrementWrapStencilOp:ThreeDecrementWrapStencilOp,DefaultLoadingManager:ThreeDefaultLoadingManager,DepthFormat:ThreeDepthFormat,DepthStencilFormat:ThreeDepthStencilFormat,DepthTexture:ThreeDepthTexture,DetachedBindMode:ThreeDetachedBindMode,DirectionalLight:ThreeDirectionalLight,DirectionalLightHelper:ThreeDirectionalLightHelper,DiscreteInterpolant:ThreeDiscreteInterpolant,DodecahedronGeometry:ThreeDodecahedronGeometry,DoubleSide:ThreeDoubleSide,DstAlphaFactor:ThreeDstAlphaFactor,DstColorFactor:ThreeDstColorFactor,DynamicCopyUsage:ThreeDynamicCopyUsage,DynamicDrawUsage:ThreeDynamicDrawUsage,DynamicReadUsage:ThreeDynamicReadUsage,EdgesGeometry:ThreeEdgesGeometry,EllipseCurve:ThreeEllipseCurve,EqualCompare:ThreeEqualCompare,EqualDepth:ThreeEqualDepth,EqualStencilFunc:ThreeEqualStencilFunc,EquirectangularReflectionMapping:ThreeEquirectangularReflectionMapping,EquirectangularRefractionMapping:ThreeEquirectangularRefractionMapping,Euler:ThreeEuler,EventDispatcher:ThreeEventDispatcher,ExternalTexture:ThreeExternalTexture,ExtrudeGeometry:ThreeExtrudeGeometry,FileLoader:ThreeFileLoader,Float16BufferAttribute:ThreeFloat16BufferAttribute,Float32BufferAttribute:ThreeFloat32BufferAttribute,FloatType:ThreeFloatType,Fog:ThreeFog,FogExp2:ThreeFogExp2,FramebufferTexture:ThreeFramebufferTexture,FrontSide:ThreeFrontSide,Frustum:ThreeFrustum,FrustumArray:ThreeFrustumArray,GLBufferAttribute:ThreeGLBufferAttribute,GLSL1:ThreeGLSL1,GLSL3:ThreeGLSL3,GreaterCompare:ThreeGreaterCompare,GreaterDepth:ThreeGreaterDepth,GreaterEqualCompare:ThreeGreaterEqualCompare,GreaterEqualDepth:ThreeGreaterEqualDepth,GreaterEqualStencilFunc:ThreeGreaterEqualStencilFunc,GreaterStencilFunc:ThreeGreaterStencilFunc,GridHelper:ThreeGridHelper,Group:ThreeGroup,HTMLTexture:ThreeHTMLTexture,HalfFloatType:ThreeHalfFloatType,HemisphereLight:ThreeHemisphereLight,HemisphereLightHelper:ThreeHemisphereLightHelper,IcosahedronGeometry:ThreeIcosahedronGeometry,ImageBitmapLoader:ThreeImageBitmapLoader,ImageLoader:ThreeImageLoader,ImageUtils:ThreeImageUtils,IncrementStencilOp:ThreeIncrementStencilOp,IncrementWrapStencilOp:ThreeIncrementWrapStencilOp,InstancedBufferAttribute:ThreeInstancedBufferAttribute,InstancedBufferGeometry:ThreeInstancedBufferGeometry,InstancedInterleavedBuffer:ThreeInstancedInterleavedBuffer,InstancedMesh:ThreeInstancedMesh,Int16BufferAttribute:ThreeInt16BufferAttribute,Int32BufferAttribute:ThreeInt32BufferAttribute,Int8BufferAttribute:ThreeInt8BufferAttribute,IntType:ThreeIntType,InterleavedBuffer:ThreeInterleavedBuffer,InterleavedBufferAttribute:ThreeInterleavedBufferAttribute,Interpolant:ThreeInterpolant,InterpolateBezier:ThreeInterpolateBezier,InterpolateDiscrete:ThreeInterpolateDiscrete,InterpolateLinear:ThreeInterpolateLinear,InterpolateSmooth:ThreeInterpolateSmooth,InterpolationSamplingMode:ThreeInterpolationSamplingMode,InterpolationSamplingType:ThreeInterpolationSamplingType,InvertStencilOp:ThreeInvertStencilOp,KeepStencilOp:ThreeKeepStencilOp,KeyframeTrack:ThreeKeyframeTrack,LOD:ThreeLOD,LatheGeometry:ThreeLatheGeometry,Layers:ThreeLayers,LessCompare:ThreeLessCompare,LessDepth:ThreeLessDepth,LessEqualCompare:ThreeLessEqualCompare,LessEqualDepth:ThreeLessEqualDepth,LessEqualStencilFunc:ThreeLessEqualStencilFunc,LessStencilFunc:ThreeLessStencilFunc,Light:ThreeLight,LightProbe:ThreeLightProbe,LightShadow:ThreeLightShadow,Line:ThreeLine,Line3:ThreeLine3,LineBasicMaterial:ThreeLineBasicMaterial,LineCurve:ThreeLineCurve,LineCurve3:ThreeLineCurve3,LineDashedMaterial:ThreeLineDashedMaterial,LineLoop:ThreeLineLoop,LineSegments:ThreeLineSegments,LinearFilter:ThreeLinearFilter,LinearInterpolant:ThreeLinearInterpolant,LinearMipMapLinearFilter:ThreeLinearMipMapLinearFilter,LinearMipMapNearestFilter:ThreeLinearMipMapNearestFilter,LinearMipmapLinearFilter:ThreeLinearMipmapLinearFilter,LinearMipmapNearestFilter:ThreeLinearMipmapNearestFilter,LinearSRGBColorSpace:ThreeLinearSRGBColorSpace,LinearToneMapping:ThreeLinearToneMapping,LinearTransfer:ThreeLinearTransfer,Loader:ThreeLoader,LoaderUtils:ThreeLoaderUtils,LoadingManager:ThreeLoadingManager,LoopOnce:ThreeLoopOnce,LoopPingPong:ThreeLoopPingPong,LoopRepeat:ThreeLoopRepeat,MOUSE:ThreeMOUSE,Material:ThreeMaterial,MaterialBlending:ThreeMaterialBlending,MaterialLoader:ThreeMaterialLoader,MathUtils:ThreeMathUtils,Matrix2:ThreeMatrix2,Matrix3:ThreeMatrix3,Matrix4:ThreeMatrix4,MaxEquation:ThreeMaxEquation,Mesh:ThreeMesh,MeshBasicMaterial:ThreeMeshBasicMaterial,MeshDepthMaterial:ThreeMeshDepthMaterial,MeshDistanceMaterial:ThreeMeshDistanceMaterial,MeshLambertMaterial:ThreeMeshLambertMaterial,MeshMatcapMaterial:ThreeMeshMatcapMaterial,MeshNormalMaterial:ThreeMeshNormalMaterial,MeshPhongMaterial:ThreeMeshPhongMaterial,MeshPhysicalMaterial:ThreeMeshPhysicalMaterial,MeshStandardMaterial:ThreeMeshStandardMaterial,MeshToonMaterial:ThreeMeshToonMaterial,MinEquation:ThreeMinEquation,MirroredRepeatWrapping:ThreeMirroredRepeatWrapping,MixOperation:ThreeMixOperation,MultiplyBlending:ThreeMultiplyBlending,MultiplyOperation:ThreeMultiplyOperation,NearestFilter:ThreeNearestFilter,NearestMipMapLinearFilter:ThreeNearestMipMapLinearFilter,NearestMipMapNearestFilter:ThreeNearestMipMapNearestFilter,NearestMipmapLinearFilter:ThreeNearestMipmapLinearFilter,NearestMipmapNearestFilter:ThreeNearestMipmapNearestFilter,NeutralToneMapping:ThreeNeutralToneMapping,NeverCompare:ThreeNeverCompare,NeverDepth:ThreeNeverDepth,NeverStencilFunc:ThreeNeverStencilFunc,NoBlending:ThreeNoBlending,NoColorSpace:ThreeNoColorSpace,NoNormalPacking:ThreeNoNormalPacking,NoToneMapping:ThreeNoToneMapping,NormalAnimationBlendMode:ThreeNormalAnimationBlendMode,NormalBlending:ThreeNormalBlending,NormalGAPacking:ThreeNormalGAPacking,NormalRGPacking:ThreeNormalRGPacking,NotEqualCompare:ThreeNotEqualCompare,NotEqualDepth:ThreeNotEqualDepth,NotEqualStencilFunc:ThreeNotEqualStencilFunc,NumberKeyframeTrack:ThreeNumberKeyframeTrack,Object3D:ThreeObject3D,ObjectLoader:ThreeObjectLoader,ObjectSpaceNormalMap:ThreeObjectSpaceNormalMap,OctahedronGeometry:ThreeOctahedronGeometry,OneFactor:ThreeOneFactor,OneMinusConstantAlphaFactor:ThreeOneMinusConstantAlphaFactor,OneMinusConstantColorFactor:ThreeOneMinusConstantColorFactor,OneMinusDstAlphaFactor:ThreeOneMinusDstAlphaFactor,OneMinusDstColorFactor:ThreeOneMinusDstColorFactor,OneMinusSrcAlphaFactor:ThreeOneMinusSrcAlphaFactor,OneMinusSrcColorFactor:ThreeOneMinusSrcColorFactor,OrthographicCamera:ThreeOrthographicCamera,PCFShadowMap:ThreePCFShadowMap,PCFSoftShadowMap:ThreePCFSoftShadowMap,PMREMGenerator:ThreePMREMGenerator,Path:ThreePath,PerspectiveCamera:ThreePerspectiveCamera,Plane:ThreePlane,PlaneGeometry:ThreePlaneGeometry,PlaneHelper:ThreePlaneHelper,PointLight:ThreePointLight,PointLightHelper:ThreePointLightHelper,Points:ThreePoints,PointsMaterial:ThreePointsMaterial,PolarGridHelper:ThreePolarGridHelper,PolyhedronGeometry:ThreePolyhedronGeometry,PositionalAudio:ThreePositionalAudio,PropertyBinding:ThreePropertyBinding,PropertyMixer:ThreePropertyMixer,QuadraticBezierCurve:ThreeQuadraticBezierCurve,QuadraticBezierCurve3:ThreeQuadraticBezierCurve3,Quaternion:ThreeQuaternion,QuaternionKeyframeTrack:ThreeQuaternionKeyframeTrack,QuaternionLinearInterpolant:ThreeQuaternionLinearInterpolant,R11_EAC_Format:ThreeR11_EAC_Format,RED_GREEN_RGTC2_Format:ThreeRED_GREEN_RGTC2_Format,RED_RGTC1_Format:ThreeRED_RGTC1_Format,REVISION:ThreeREVISION,RG11_EAC_Format:ThreeRG11_EAC_Format,RGBADepthPacking:ThreeRGBADepthPacking,RGBAFormat:ThreeRGBAFormat,RGBAIntegerFormat:ThreeRGBAIntegerFormat,RGBA_ASTC_10x10_Format:ThreeRGBA_ASTC_10x10_Format,RGBA_ASTC_10x5_Format:ThreeRGBA_ASTC_10x5_Format,RGBA_ASTC_10x6_Format:ThreeRGBA_ASTC_10x6_Format,RGBA_ASTC_10x8_Format:ThreeRGBA_ASTC_10x8_Format,RGBA_ASTC_12x10_Format:ThreeRGBA_ASTC_12x10_Format,RGBA_ASTC_12x12_Format:ThreeRGBA_ASTC_12x12_Format,RGBA_ASTC_4x4_Format:ThreeRGBA_ASTC_4x4_Format,RGBA_ASTC_5x4_Format:ThreeRGBA_ASTC_5x4_Format,RGBA_ASTC_5x5_Format:ThreeRGBA_ASTC_5x5_Format,RGBA_ASTC_6x5_Format:ThreeRGBA_ASTC_6x5_Format,RGBA_ASTC_6x6_Format:ThreeRGBA_ASTC_6x6_Format,RGBA_ASTC_8x5_Format:ThreeRGBA_ASTC_8x5_Format,RGBA_ASTC_8x6_Format:ThreeRGBA_ASTC_8x6_Format,RGBA_ASTC_8x8_Format:ThreeRGBA_ASTC_8x8_Format,RGBA_BPTC_Format:ThreeRGBA_BPTC_Format,RGBA_ETC2_EAC_Format:ThreeRGBA_ETC2_EAC_Format,RGBA_PVRTC_2BPPV1_Format:ThreeRGBA_PVRTC_2BPPV1_Format,RGBA_PVRTC_4BPPV1_Format:ThreeRGBA_PVRTC_4BPPV1_Format,RGBA_S3TC_DXT1_Format:ThreeRGBA_S3TC_DXT1_Format,RGBA_S3TC_DXT3_Format:ThreeRGBA_S3TC_DXT3_Format,RGBA_S3TC_DXT5_Format:ThreeRGBA_S3TC_DXT5_Format,RGBDepthPacking:ThreeRGBDepthPacking,RGBFormat:ThreeRGBFormat,RGBIntegerFormat:ThreeRGBIntegerFormat,RGB_BPTC_SIGNED_Format:ThreeRGB_BPTC_SIGNED_Format,RGB_BPTC_UNSIGNED_Format:ThreeRGB_BPTC_UNSIGNED_Format,RGB_ETC1_Format:ThreeRGB_ETC1_Format,RGB_ETC2_Format:ThreeRGB_ETC2_Format,RGB_PVRTC_2BPPV1_Format:ThreeRGB_PVRTC_2BPPV1_Format,RGB_PVRTC_4BPPV1_Format:ThreeRGB_PVRTC_4BPPV1_Format,RGB_S3TC_DXT1_Format:ThreeRGB_S3TC_DXT1_Format,RGDepthPacking:ThreeRGDepthPacking,RGFormat:ThreeRGFormat,RGIntegerFormat:ThreeRGIntegerFormat,RawShaderMaterial:ThreeRawShaderMaterial,Ray:ThreeRay,Raycaster:ThreeRaycaster,RectAreaLight:ThreeRectAreaLight,RedFormat:ThreeRedFormat,RedIntegerFormat:ThreeRedIntegerFormat,ReinhardToneMapping:ThreeReinhardToneMapping,RenderObjectRefreshType:ThreeRenderObjectRefreshType,RenderTarget:ThreeRenderTarget,RenderTarget3D:ThreeRenderTarget3D,RepeatWrapping:ThreeRepeatWrapping,ReplaceStencilOp:ThreeReplaceStencilOp,ReverseSubtractEquation:ThreeReverseSubtractEquation,RingGeometry:ThreeRingGeometry,SIGNED_R11_EAC_Format:ThreeSIGNED_R11_EAC_Format,SIGNED_RED_GREEN_RGTC2_Format:ThreeSIGNED_RED_GREEN_RGTC2_Format,SIGNED_RED_RGTC1_Format:ThreeSIGNED_RED_RGTC1_Format,SIGNED_RG11_EAC_Format:ThreeSIGNED_RG11_EAC_Format,SRGBColorSpace:ThreeSRGBColorSpace,SRGBTransfer:ThreeSRGBTransfer,Scene:ThreeScene,ShaderChunk:ThreeShaderChunk,ShaderLib:ThreeShaderLib,ShaderMaterial:ThreeShaderMaterial,ShadowMaterial:ThreeShadowMaterial,Shape:ThreeShape,ShapeGeometry:ThreeShapeGeometry,ShapePath:ThreeShapePath,ShapeUtils:ThreeShapeUtils,ShortType:ThreeShortType,Skeleton:ThreeSkeleton,SkeletonHelper:ThreeSkeletonHelper,SkinnedMesh:ThreeSkinnedMesh,Source:ThreeSource,Sphere:ThreeSphere,SphereGeometry:ThreeSphereGeometry,Spherical:ThreeSpherical,SphericalHarmonics3:ThreeSphericalHarmonics3,SplineCurve:ThreeSplineCurve,SpotLight:ThreeSpotLight,SpotLightHelper:ThreeSpotLightHelper,Sprite:ThreeSprite,SpriteMaterial:ThreeSpriteMaterial,SrcAlphaFactor:ThreeSrcAlphaFactor,SrcAlphaSaturateFactor:ThreeSrcAlphaSaturateFactor,SrcColorFactor:ThreeSrcColorFactor,StaticCopyUsage:ThreeStaticCopyUsage,StaticDrawUsage:ThreeStaticDrawUsage,StaticReadUsage:ThreeStaticReadUsage,StereoCamera:ThreeStereoCamera,StreamCopyUsage:ThreeStreamCopyUsage,StreamDrawUsage:ThreeStreamDrawUsage,StreamReadUsage:ThreeStreamReadUsage,StringKeyframeTrack:ThreeStringKeyframeTrack,SubtractEquation:ThreeSubtractEquation,SubtractiveBlending:ThreeSubtractiveBlending,TOUCH:ThreeTOUCH,TangentSpaceNormalMap:ThreeTangentSpaceNormalMap,TetrahedronGeometry:ThreeTetrahedronGeometry,Texture:ThreeTexture,TextureLoader:ThreeTextureLoader,TextureSource:ThreeTextureSource,TextureUtils:ThreeTextureUtils,Timer:ThreeTimer,TimestampQuery:ThreeTimestampQuery,TorusGeometry:ThreeTorusGeometry,TorusKnotGeometry:ThreeTorusKnotGeometry,Triangle:ThreeTriangle,TriangleFanDrawMode:ThreeTriangleFanDrawMode,TriangleStripDrawMode:ThreeTriangleStripDrawMode,TrianglesDrawMode:ThreeTrianglesDrawMode,TubeGeometry:ThreeTubeGeometry,UVMapping:ThreeUVMapping,Uint16BufferAttribute:ThreeUint16BufferAttribute,Uint32BufferAttribute:ThreeUint32BufferAttribute,Uint8BufferAttribute:ThreeUint8BufferAttribute,Uint8ClampedBufferAttribute:ThreeUint8ClampedBufferAttribute,Uniform:ThreeUniform,UniformsGroup:ThreeUniformsGroup,UniformsLib:ThreeUniformsLib,UniformsUtils:ThreeUniformsUtils,UnsignedByteType:ThreeUnsignedByteType,UnsignedInt101111Type:ThreeUnsignedInt101111Type,UnsignedInt248Type:ThreeUnsignedInt248Type,UnsignedInt5999Type:ThreeUnsignedInt5999Type,UnsignedIntType:ThreeUnsignedIntType,UnsignedShort4444Type:ThreeUnsignedShort4444Type,UnsignedShort5551Type:ThreeUnsignedShort5551Type,UnsignedShortType:ThreeUnsignedShortType,VSMShadowMap:ThreeVSMShadowMap,Vector2:ThreeVector2,Vector3:ThreeVector3,Vector4:ThreeVector4,VectorKeyframeTrack:ThreeVectorKeyframeTrack,VideoFrameTexture:ThreeVideoFrameTexture,VideoTexture:ThreeVideoTexture,WebGL3DRenderTarget:ThreeWebGL3DRenderTarget,WebGLArrayRenderTarget:ThreeWebGLArrayRenderTarget,WebGLCoordinateSystem:ThreeWebGLCoordinateSystem,WebGLCubeRenderTarget:ThreeWebGLCubeRenderTarget,WebGLRenderTarget:ThreeWebGLRenderTarget,WebGLRenderer:ThreeWebGLRenderer,WebGLUtils:ThreeWebGLUtils,WebGPUCoordinateSystem:ThreeWebGPUCoordinateSystem,WebXRController:ThreeWebXRController,WireframeGeometry:ThreeWireframeGeometry,WrapAroundEnding:ThreeWrapAroundEnding,ZeroCurvatureEnding:ThreeZeroCurvatureEnding,ZeroFactor:ThreeZeroFactor,ZeroSlopeEnding:ThreeZeroSlopeEnding,ZeroStencilOp:ThreeZeroStencilOp,createCanvasElement:ThreecreateCanvasElement,error:Threeerror,getConsoleFunction:ThreegetConsoleFunction,log:Threelog,setConsoleFunction:ThreesetConsoleFunction,warn:Threewarn,warnOnce:ThreewarnOnce},Symbol.toStringTag,{value:"Module"}));export{Ry,ThreeACESFilmicToneMapping,ThreeAddEquation,ThreeAdditiveBlending,ThreeAgXToneMapping,ThreeBackSide,ThreeBox3,ThreeBoxGeometry,ThreeBufferAttribute,ThreeBufferGeometry,ThreeCamera,ThreeCanvasTexture,ThreeCineonToneMapping,ThreeCircleGeometry,ThreeClampToEdgeWrapping,ThreeColor,ThreeColorManagement,ThreeConeGeometry,ThreeCustomBlending,ThreeCustomToneMapping,ThreeData3DTexture,ThreeDataTexture,ThreeDataUtils,ThreeDepthFormat,ThreeDepthTexture,ThreeDirectionalLight,ThreeDoubleSide,ThreeDynamicDrawUsage,ThreeEuler,ThreeFloat32BufferAttribute,ThreeFloatType,ThreeFrontSide,ThreeFrustum,ThreeGreaterDepth,ThreeGreaterEqualCompare,ThreeGroup,ThreeHalfFloatType,ThreeHemisphereLight,ThreeIcosahedronGeometry,ThreeInstancedBufferAttribute,ThreeInstancedBufferGeometry,ThreeInstancedMesh,ThreeLessEqualCompare,ThreeLinearFilter,ThreeLinearMipmapLinearFilter,ThreeLinearToneMapping,ThreeMathUtils,ThreeMatrix3,ThreeMatrix4,ThreeMesh,ThreeMeshBasicMaterial,ThreeMeshDepthMaterial,ThreeMeshPhysicalMaterial,ThreeMeshStandardMaterial,ThreeNearestFilter,ThreeNeutralToneMapping,ThreeNoBlending,ThreeNoColorSpace,ThreeOneFactor,ThreeOneMinusSrcAlphaFactor,ThreeOrthographicCamera,ThreePCFShadowMap,ThreePMREMGenerator,ThreePerspectiveCamera,ThreePlane,ThreePlaneGeometry,ThreePointLight,ThreePoints,ThreeQuaternion,ThreeRGBADepthPacking,ThreeRGBAFormat,ThreeRawShaderMaterial,ThreeRay,ThreeRaycaster,ThreeRedFormat,ThreeReinhardToneMapping,ThreeRepeatWrapping,ThreeSRGBColorSpace,ThreeSRGBTransfer,ThreeScene,ThreeShaderChunk,ThreeShaderMaterial,ThreeShape,ThreeShapeGeometry,ThreeSphere,ThreeSphereGeometry,ThreeSrcColorFactor,ThreeTimer,ThreeUint16BufferAttribute,ThreeUint32BufferAttribute,ThreeUniformsLib,ThreeUniformsUtils,ThreeUnsignedByteType,ThreeUnsignedIntType,ThreeVector2,ThreeVector3,ThreeVector4,ThreeWebGLRenderTarget,ThreeWebGLRenderer,ThreeZeroFactor};
