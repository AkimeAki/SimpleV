const schemeDef = (db: IDBDatabase) => {
	db.createObjectStore("simplev", { keyPath: "id", autoIncrement: true });
};

export const connect = (dbname: string, version: number) => {
	const dbp = new Promise((resolve, reject) => {
		const req = window.indexedDB.open(dbname, version);
		req.onsuccess = (e) => {
			return resolve((e.target as IDBOpenDBRequest).result);
		};
		req.onerror = () => {
			return reject("fails to open db");
		};
		req.onupgradeneeded = (e) => {
			return schemeDef((e.target as IDBOpenDBRequest).result);
		};
	});

	// dbp.then((d) => (d.onerror = (ev) => alert("error: " + ev.target.errorCode)));

	return dbp;
};
