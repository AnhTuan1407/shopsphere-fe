import FlashSaleItem from "./flashSaleItem.model";

type FlashSale = {
    id: number,
    name: string,
    description: string,
    startTime: Date,
    endTime: Date,
    status: string,
    createdAt: Date,
    flashSaleItems: Array<FlashSaleItem>
}

export default FlashSale;