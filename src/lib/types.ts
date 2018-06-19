interface IAuthorsObject {
	music?: number[];
	lyrics?: number[];
}

interface IVariant {
	text: string;
	description: string;
	visibility?: any; // TODO what options do we have
}

interface ISong {
	title: string;
	authors?: IAuthorsObject;
	interpreters?: number[];
	variant: IVariant;
}

interface ISongBookSong {
	variantId: number;
	order?: number;
}

interface ISongBook {
	title: string;
	songs: ISongBookSong[];
}
