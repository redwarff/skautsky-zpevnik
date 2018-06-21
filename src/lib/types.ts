interface IAuthorsObject {
	music?: number[];
	lyrics?: number[];
}

interface IVariant {
	id: string;
	text: string;
	description: string;
	visibility?: any; // TODO what options do we have
}

interface ISong {
	title: string;
	authors: IAuthorsObject;
	interpreters: number[];
	variants: IVariant[];
}

interface ISongBookSong {
	variantId: number;
	order?: number;
}

interface ISongBook {
	title: string;
	songs: ISongBookSong[];
}

interface IRootStore {
	modules: any;
}

interface ISongListStoreState {
	state: EStateTypes;
	items: ISong[];
	searchQuery?: string;
	page: number;
	perPage: number;
	total: number;
	error?: any;
}

interface IInterpreter {
	id: string;
	name: string;
}

interface IInterpreterStoreState {
	state: EStateTypes;
	items: IInterpreter[];
	error?: any;
}

interface IUserSimple {
	name: string;
	id: string;
}

interface IUser {
	id: string;
	name: string;
	logoutLink: string;
}

interface IUserStoreState {
	state: EStateTypes;
	items: IUserSimple[];
	currentUser?: IUser;
	error?: any;
}

interface ISongListStoreGetters {
	readonly lastPage: number;
	readonly canNext: boolean;
	readonly canPrev: boolean;
}

enum EStateTypes {
	loading,
	failed,
	ready,
}
