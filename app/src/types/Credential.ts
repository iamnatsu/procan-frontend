export class Credential {
    'lastAccessedAt': string;
    'expireAt': string;
    'userId': string;
    'parentId': string;
    'domainId': string;
    'lastLoginAt': string;
    'payload': { [key: string]: string; };
//    'permissions': Array<Credential.PermissionsEnum>;
//    'scope': Array<Credential.ScopeEnum>;
    'temporarilyChildren': Array<Credential>;
    'name': string;
//    'client': FederationSubject;
    'id': string;
    'operatorId': string;
    'temporal': boolean;
  }