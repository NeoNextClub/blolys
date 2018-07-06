import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
    // public apiDomain: String = 'http://192.168.1.39:8080';  // Mainnet
    // public apiDotest: String = 'http://192.168.1.39:8002';  // Testnet
    public apiDomain: String = 'https://api.iwallic.com';
    public apiDotest: String = 'https://teapi.iwallic.com';
    // public apiDomain: String = 'http://149.28.17.215:8080';
    public netDomain: String = 'mainnet';
    public netDotest: String = 'testnet';
    constructor() { }
}
