export class InfoPanel {
  constructor() {
    this.countEl = document.getElementById("count");
    this.lastCount = -1;

    this.areaEl = document.getElementById("area");
    this.lastArea = -1;
  }

  setVisibleShapesCount(count) {
    if (count === this.lastCount) return;
    this.lastCount = count;
    this.countEl.textContent = count;
  }

  setVisibleShapesArea(visibleArea) {
    const roundedArea = Math.round(visibleArea);
    if (roundedArea !== this.lastArea) {
      this.lastArea = roundedArea;
      this.areaEl.textContent = roundedArea;
    }
  }
}
