

export abstract class AbstractDomain {
    id: string;
    createdAt: Date;
    modifiedAt: Date;
    deletedAt: Date | null;
}