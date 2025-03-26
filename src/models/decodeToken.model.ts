type DecodedToken = {
    sub: string;
    exp: number;
    iat: number;
    userId: string;
    iss?: string;
    jti?: string;
    scope?: string;
};

export default DecodedToken;