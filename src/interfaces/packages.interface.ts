export interface Package {
    id?: string;            // Unique identifier for the package
    name: string;          // Name of the package
    description: number;   // Description of the package (consider changing to string if needed)
    weight: number;        // Weight of the package
    depositorId: number;   // ID of the depositor
    depositeeId?: number;   // ID of the depositee
    isAvailable: boolean;   // Availability status of the package
    isReceived: boolean;    // Reception status of the package
  }
  
  export interface PackageId {
    id: string;            // Unique identifier for the package
  }
  
  export interface PackageList {
    package: Package[];    // Array of packages
  }
  