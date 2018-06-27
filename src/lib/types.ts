interface IAuthorsObject {
	music?: string[];
	lyrics?: string[];
}

interface IVariant {
	id: string;
	text: string;
	title: string;
	description: string;
	visibility?: number;
}

interface ISong {
	id: string;
	title: string;
	authors: IAuthorsObject;
	interpreters: string[];
	variants: IVariant[];
}

interface ICreateSong {
	title: string;
	authors: IAuthorsObject;
	interpreters: string[];
	variant: Partial<IVariant>;
}

interface ISongbookSong {
	variant_id: string;
	order: number;
	song: ISongbookSongSong;
}

interface ISongbookSongSong {
	song_id: string;
	title: string;
	interpreters: IInterpreter[];
}

interface ISongbookOptions {
	chorded: boolean;
	columns: number;
	format: string;
	front_index: boolean;
	index: boolean;
	page_numbering: boolean;
	song_numbering: boolean;
}

interface ISongbook {
	id: string;
	title: string;
	songs: ISongbookSong[];
	options: ISongbookOptions;
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

interface ISongbookListStoreState {
	state: EStateTypes;
	items: ISongbook[];
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

interface IAuthor {
	id: string;
	name: string;
}

interface IInterpreterStoreState {
	state: EStateTypes;
	items: IInterpreter[];
	error?: any;
}

interface IAuthorStoreState {
	state: EStateTypes;
	items: IInterpreter[];
	error?: any;
}

interface ISongStoreState {
	state: EStateTypes;
	song?: ISong;
	error?: any;
}

interface ISongbookStoreState {
	state: EStateTypes;
	songbook?: ISongbook;
	error?: any;
	exportLink: string;
	exportState?: EStateTypes;
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

interface ISelectOption {
	value: any;
	label: string;
}

enum EStateTypes {
	loading,
	failed,
	ready,
}
