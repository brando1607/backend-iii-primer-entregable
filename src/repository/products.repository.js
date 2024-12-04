export class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getAll() {
    return await this.dao.getAll();
  }
  async getById({ productId }) {
    return await this.dao.getById({ productId });
  }
  async create(product) {
    return await this.dao.create(product);
  }
  async update({ data }) {
    return await this.dao.update({ data });
  }
  async delete({ productId }) {
    return await this.dao.delete({ productId });
  }
}
