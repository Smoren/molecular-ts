import { LinkAllocatorInterface, LinkManagerInterface } from './types/helpers';
import { AtomInterface, LinkInterface } from './types/atomic';
import { Link } from './atomic';
import { Swarm } from './tools/swarm';

class LinkAllocator implements LinkAllocatorInterface {
  private storage: LinkInterface[] = [];

  allocate(id: number, lhs: AtomInterface, rhs: AtomInterface): LinkInterface {
    if (this.storage.length) {
      const result = this.storage.pop();
      result.id = id;
      result.lhs = lhs;
      result.rhs = rhs;
      return result;
    }
    return new Link(id, lhs, rhs);
  }

  free(link: LinkInterface): void {
    this.storage.push(link);
  }
}

export class LinkManager implements LinkManagerInterface {
  private storage: Swarm<LinkInterface> = new Swarm();
  private allocator: LinkAllocatorInterface = new LinkAllocator();

  create(lhs: AtomInterface, rhs: AtomInterface): LinkInterface {
    const link = this.allocator.allocate(this.storage.nextKey, lhs, rhs);
    this.storage.push(link);
    return link;
  }

  delete(link: LinkInterface): void {
    this.storage.pop(link.id);
    this.allocator.free(link);
  }

  * [Symbol.iterator](): Iterator<LinkInterface> {
    for (const item of this.storage) {
      yield item;
    }
  }
}
