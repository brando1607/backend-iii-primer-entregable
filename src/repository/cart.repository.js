export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async create({ tokenData, body }) {
    return await this.dao.create({ tokenData, body });
  }
  async getById({ cartId }) {
    return await this.dao.getById({ cartId });
  }
  async delete({ cartId }) {
    return await this.dao.delete({ cartId });
  }
  async addProduct({ tokenData, body }) {
    return await this.dao.addProduct({ tokenData, body });
  }
  async removeProduct({ params }) {
    return await this.dao.removeProduct({ params });
  }
  async purchase({ cartId }) {
    return await this.dao.purchase({ cartId });
  }
}
