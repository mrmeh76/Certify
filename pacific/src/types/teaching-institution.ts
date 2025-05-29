export class TeachingInstitution {
    name: string;
    wallet_address: string;
    image_url: string

    constructor(institution_name: string, wallet_address: string, image_url: string) {
        this.name = institution_name;
        this.wallet_address = wallet_address;
        this.image_url = image_url
    }
}