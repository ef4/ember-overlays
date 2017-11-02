export default class MarkInfo {
  constructor(id, firstNode, lastNode, group, model) {
    this.id = id;
    this._firstNode = firstNode;
    this._lastNode = lastNode;
    this.group = group;
    this.model = model;
  }

  bounds() {
    if (!this._firstNode.parentNode || !this._lastNode.parentNode) { return; }
    let r = new Range();
    r.setStartBefore(this._firstNode);
    r.setEndAfter(this._lastNode);
    return r.getBoundingClientRect();
  }

}
