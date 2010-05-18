(function(ext){
	function ExtensibleFill(fill){
		var settings=new ext.Object({
			style:'solid',
			color:'#000000',
			bitmapIsClipped:undefined,
			bitmapPath:undefined,
			colorArray:undefined,
			focalPoint:undefined,
			linearRGB:undefined,
			matrix:undefined,
			overflow:undefined,
			posArray:undefined
		});
		if(typeof fill=='string'){
			settings.color=fill;
		}else{
			settings.extend(fill);
		}
		ext.Object.apply(this,[settings,1]);
		if(this.matrix && !(this.matrix instanceof ext.Matrix)){
			this.matrix=new ext.Matrix(this.matrix);
		}
		return this;
	}
	ExtensibleFill.prototype={
		__proto__:ext.Object.prototype,
		type:ExtensibleFill,
		get isOpaque(){
			var colorArray=this.colorArray||new ext.Array();
			colorArray.unshift(this.color);
			for(var i=0;i<colorArray.length;i++){
				var color=new ext.Color(colorArray[i]);
				if(color.opacity<1){
					return false;
				}
			}
			return true;
		},
		set isOpaque(){
			return;
		}, 
		is:function(f){
			if(this.style!=f.style){
				return false;
			}else if(this.style=='bitmap'){
				if(this.bitmapPath!=f.bitmapPath){return false;}
			}else if(this.style=='linearGradient' || this.style=='radialGradient'){
				if(
					!this.colorArray.is(f.colorArray) ||
					!this.posArray.is(f.posArray) ||
					(this.style=='radialGradient' && this.focalPoint!=f.focalPoint) ||
					this.linearRGB!=f.linearRGB
				){
					return false;
				}
			}else if(this.style=='solid'){
				if(this.color!=f.color){return false;}
			}
			if(
				(
					this.style=='bitmap' ||
					this.style=='linearGradient' ||
					this.style=='radialGradient'
				) && 
				!this.matrix.is(f.matrix)
			){
				return false;
			}
			return true;
		}
	}
	ext.extend({Fill:ExtensibleFill});
})(extensible)
