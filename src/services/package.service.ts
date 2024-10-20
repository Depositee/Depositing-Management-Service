/* eslint-disable prettier/prettier */
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import packageClient from '@/client/packageClient';
import { Package,PackageId,PackageList } from '@/interfaces/packages.interface';
import { Order } from '@/interfaces/orders.interface';

@Service()
export class PackageService {
  public async getAllPackages(): Promise<Package[]> {
    return new Promise((resolve, reject) => {
      packageClient.GetAll({}, (error, response: PackageList) => {
        if (error) {
          return reject(new HttpException(500, error.message));
        }
        resolve(response.package);
      });
    });
  }

  public async getPackageById(packageId: string): Promise<Package> {
    return new Promise((resolve, reject) => {
      const request: PackageId = { id: packageId };
      packageClient.Get(request, (error, response: Package) => {
        if (error) {
          return reject(new HttpException(500, error.message));
        }
        resolve(response);
      });
    });
  }

  public async createPackage(packageData: Package): Promise<Package> {
    return new Promise((resolve, reject) => {
      packageClient.Create(packageData, (error, response: Package) => {
        if (error) {
          return reject(new HttpException(500, error.message));
        }
        resolve(response);
      });
    });
  }

  public async updatePackage(packageData: Package): Promise<Package> {
    return new Promise((resolve, reject) => {
      packageClient.Update(packageData, (error, response: Package) => {
        if (error) {
          return reject(new HttpException(500, error.message));
        }
        resolve(response);
      });
    });
  }

  public async deletePackage(packageId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: PackageId = { id: packageId };
      packageClient.Delete(request, (error) => {
        if (error) {
          return reject(new HttpException(500, error.message));
        }
        resolve();
      });
    });
  }

  public async createNewPackageFromOrder(order : Order ,packageData : Package): Promise<Package> {
    const newPackage : Package = {
      name : packageData.name,
      description : packageData.description,
      weight : packageData.weight,
      depositorId : order.depositorId,
      isAvailable : true,
      isReceived : false
    }
    return this.createPackage(newPackage)
  }
  public async updatePackageFromOrder(order : Order ,packageData : Package): Promise<Package> {

    let packageAvailable = true
    let packageReceived = true
    let depositeeId = null
    switch (order.status) {
      case "placed":
          break;
      case "reserved":
          packageAvailable = false
          depositeeId = order.depositeeId
          break;
      case "received":
          packageAvailable = false
          packageReceived = true
          depositeeId = order.depositeeId
          break;
      case "completed":
        packageAvailable = false
        packageReceived = true
        depositeeId = order.depositeeId
          break;
      default:
          return;  
  }
    const updatePackage : Package = {
      name : packageData.name,
      description : packageData.description,
      weight : packageData.weight,
      depositorId : order.depositorId,
      depositeeId : depositeeId,
      isAvailable : packageAvailable,
      isReceived : packageReceived
    }
    return this.updatePackage(updatePackage)
  }
}
