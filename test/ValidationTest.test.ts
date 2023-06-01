import * as chai from 'chai'
import { ObjectId } from 'mongodb'
import { Article } from './models/Article'
import * as chaiAsPromised from 'chai-as-promised';
import { InvalidFieldTypeError, RequiredFieldError } from '../src/Validators'

chai.use(chaiAsPromised);

describe('Validation tests', () => {

  it('should throw error for missing required data', async function () {
      const article = new Article();

      await chai.expect(article.save()).to.eventually.be.rejectedWith(RequiredFieldError);
  });

  it('should throw error for invalid number type', async function () {
      const article = new Article();
      article.name = 'Validation article name';
      (article as any).price = 'test price';

      await chai.expect(article.save()).to.eventually.be.rejectedWith(InvalidFieldTypeError);
  });

  it('should throw error for invalid string type', async function () {
      const article = new Article();
      (article as any).name = new ObjectId();

      await chai.expect(article.save()).to.eventually.be.rejectedWith(InvalidFieldTypeError);
  });

  it('should throw error for invalid boolean type', async function () {
      const article = new Article();
      article.name = 'Validation article name';
      (article as any).active = 1;

      await chai.expect(article.save()).to.eventually.be.rejectedWith(InvalidFieldTypeError);
  });
})
