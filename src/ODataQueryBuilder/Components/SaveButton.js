"use strict";
class SaveBtn extends HTMLElement {

   constructor() {
       super();
   } 
   createdCallback(){
       this.innerHTML = `
           <style> 
           p { color: orange; }
           </style>
           <p>I'm in a custom element <span id='spn' style='color:blue'></span> the below button is with me as well :).</p>
           <button id='btn'></button>
           `;
        var spn = this.querySelector('span');
        var btn = this.querySelector('button');
        btn.addEventListener('click',() => alert('The button '+btn.textContent+' had been clicked'));
   }

   attachedCallback(){
        this.querySelector('#spn').innerHTML = this.btntext != null ? this.btntext : this.dataset['text'];
        this.querySelector('#btn').textContent = this.btntext != null ? this.btntext : this.dataset['text'];
   }

   set properties(prop) {
        this.btntext = prop.text;
   }

   get text() {
        return this.textContent;
   } 
}

var MySaveBtn = document.registerElement("save-button", SaveBtn);

var myBtn = new MySaveBtn;
myBtn.properties={ text: 'Loaded from JavaScript' };  // or myBtn.text = 'click me';
document.querySelector('#placeholder').appendChild(myBtn);