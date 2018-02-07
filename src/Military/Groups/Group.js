const SimSubject = rootRequire('Military/SimSubject');

class Group extends SimSubject {
  constructor(parent) {
    super(parent);
    if (new.target === Group) {
      throw new TypeError('Cannot construct a Group directly!');
    }
    this.children = [];
  }

  keepChildrenSorted(modifiedChild, oldRating, strategy) {
    if (modifiedChild.rating === oldRating) {
      return true;
    }

    const index = this.children.indexOf(modifiedChild);
    // should it move forward or backwards
    let direction;
    if (strategy === 'strongest') {
      direction = (modifiedChild.rating > oldRating ? -1 : 1);
    } else {
      direction = (modifiedChild.rating < oldRating ? -1 : 1);
    }

    // if it's on edge its done
    if (index === 0) {
      if (this.parent) {
        this.parent.keepChildrenSorted(this, oldRating, strategy);
      }
      if (direction === -1) {
        return true;
      }
    }

    // check if it's in the right spot
    if (this._needsToMove(modifiedChild, direction, index)) {
      this._switchChildren(modifiedChild, this.children[index + direction]);
      // if first or last element got changed
      if (index === 0 || index + direction === 0) {
        if (this.parent) {
          this.parent.keepChildrenSorted(this, oldRating, strategy);
        }
      }

      this.keepChildrenSorted(modifiedChild, oldRating, strategy);

      return true;
    }
    // if it is it's done
    return true;
  }

  _switchChildren(a, b) {
    const tmp = a;
    const aIndex = this.children.indexOf(a);
    const bIndex = this.children.indexOf(b);
    this.children[aIndex] = b;
    this.children[bIndex] = tmp;
  }

  _needsToMove(modifiedChild, direction, index) {
    if (this.children[index + direction]) {
      return (direction === -1 && (modifiedChild.rating > this.children[index + direction].rating)) ||
        (direction === 1 && (modifiedChild.rating < this.children[index + direction].rating));
    }
    return false;
  }
}

module.exports = Group;
