import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[headpicker]'
})
export class HeadpickerDirective {
	
  constructor(private element: ElementRef) { }

  @HostListener('click') onclick(){
  	this.highlight();
  }

  private highlight(){
  	let headOptions = this.element.nativeElement.parentNode.parentNode.children;

  	for(var option of headOptions){
  		option.firstElementChild.style.borderColor = '';
  	}
	this.element.nativeElement.style.borderColor = '#9b59b6';
  }

}
