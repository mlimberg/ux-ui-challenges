'use strict';

class Cards {
  constructor() {
    this.cards = document.querySelectorAll('.card');
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.update = this.update.bind(this);
    this.target = null;
    this.targetBCR = null;
    this.startX = 0;
    this.currentX = 0;
    this.screenX = 0;
    this.targetX = 0;
    this.draggingCard = false;

    this.addEventListeners();

    requestAnimationFrame(this.update);
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.onStart);
    document.addEventListener('touchmove', this.onMove);
    document.addEventListener('touchend', this.onEnd);

    document.addEventListener('mousedown', this.onStart);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);

  }

  onStart(e) {
    if(this.target) return;

    if(!e.target.classList.contains('card')) return

    this.target = e.target
    this.targetBCR = this.target.getBoundingClientRect();
    this.startX = e.pageX || e.touches[0].pageX
    this.currentX = this.startX;
    this.target.style.willChange = 'transform';
    this.draggingCard = true;

    e.preventDefault();
  }

  onMove(e) {
    if(!this.target) return;

    this.currentX = e.pageX || e.touches[0].pageX
  }

  onEnd(e) {
    if(!this.target) return;


    this.draggingCard = false;
    // this.currentX = e.pageX || e.touches[0].pageX

    let screenX = this.currentX - this.startX

    if(Math.abs(screenX) > this.targetBCR.width * 0.35) {
      this.targetX = (screenX > 0) ? this.targetBCR.width : -this.targetBCR.width
    }
  }

  update() {
    requestAnimationFrame(this.update);
    if(!this.target) return;

    if(this.draggingCard) {
      this.screenX = this.currentX - this.startX;
    } else {
      this.screenX += (this.targetX - this.screenX /10)
    }

    const normalizedDragDistance = (Math.abs(this.screenX) / this.targetBCR.width);
    const opacity = 1 - Math.pow(normalizedDragDistance, 3);

    this.target.style.transform = `translate(${this.screenX}px)`
    this.target.style.opacity = opacity

    const isNearlyAtStart = (Math.abs(this.screenX) < 0.01)
    const isAlmostInvisible = (opacity < 0.01)

    if(!this.draggingCard) {
      if(isAlmostInvisible) {
        this.target.parentNode.removeChild(this.target)
        this.target = null;
      }
    }

    if(isNearlyAtStart) {
      this.target.style.willChange = 'initial';
      this.target.style.transform = 'none';ooooooo00000
      this.target = null;
    }
  }
}

window.addEventListener('load', () => new Cards());
