import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab',
  template: "<div [hidden]='!active' style='margin-top:5px;'><ng-content></ng-content></div>"
  
})
export class Tab {
	public done: boolean;
  @Input('tabTitle') title: string;
  @Input() active = false;
}