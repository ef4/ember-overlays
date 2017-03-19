export default class MarkInfo {
  constructor(id, firstNode, lastNode, type, model) {
    this.id = id;
    this._firstNode = firstNode;
    this._lastNode = lastNode;
    this.type = type;
    this.model = model;
  }

  bounds() {
    let r = new Range();
    r.setStartBefore(this._firstNode);
    r.setEndAfter(this._lastNode);
    return r.getBoundingClientRect();
  }

}
