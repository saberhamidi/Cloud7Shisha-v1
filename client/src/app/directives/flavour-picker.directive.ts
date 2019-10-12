import { Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[flavourPicker]'
})
export class FlavourPickerDirective {

  constructor() { }

  limitReached: boolean = false;

  @HostListener('change') onchange(){
   	this.disableflavours();
   }
  private disableflavours(){
	const flavours = document.querySelectorAll('.flavours');
	let numberOfPickedflavours = 0;
	for(let i = 0; i<flavours.length; i++){
		if(flavours[i].firstElementChild['checked']){
			numberOfPickedflavours ++;
		}
	}

	if(numberOfPickedflavours >=3){

		this.limitReached = true;
	}
	else{
		this.limitReached = false;
	}

	for(let i = 0; i<flavours.length; i++){

		if(flavours[i].firstElementChild['checked'] !=true && this.limitReached){
			flavours[i].firstElementChild['disabled'] = true;
		}

		else{

			flavours[i].firstElementChild['disabled'] = false;
		}
	}
  }
}
