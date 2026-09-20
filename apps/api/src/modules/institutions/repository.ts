import type { Institution } from "./types.js";
export class InstitutionRepository {
  private readonly items = new Map<string, Institution>();
  constructor(initial: Institution[] = []) {
    for (const item of initial) this.items.set(item.did, item);
  }
  list() {
    return [...this.items.values()];
  }
  findByDid(did: string) {
    return this.items.get(did);
  }
  save(institution: Institution) {
    this.items.set(institution.did, institution);
    return institution;
  }
}
