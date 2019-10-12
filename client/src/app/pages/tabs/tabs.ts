import { Component, ContentChildren, QueryList, AfterContentInit, Input } from '@angular/core';
import { Tab } from './tab';

@Component({
  selector: 'tabs',
  templateUrl: "./tabs.html",
  styleUrls: ['./tabs.css']
})
export class Tabs implements AfterContentInit {
  @Input('title') title: boolean = true;
  @ContentChildren(Tab) tabs: QueryList<Tab>;
  
  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);
    
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }
  
  selectTab(tab: Tab){
    const toBeActivedIndex = this.tabs.toArray().indexOf(tab);
    const currentActiveIndex = this.tabs.toArray().findIndex(t => t.active == true);

    //Disabled links logic
    if(toBeActivedIndex<currentActiveIndex || toBeActivedIndex == 0){
      // deactivate all tabs
      this.tabs.toArray().forEach(function(tab, index){
        tab.active = false;
        tab.done = index<toBeActivedIndex;
      });
      // activate the tab the user has clicked on.
      tab.active = true;
    }
  }

}