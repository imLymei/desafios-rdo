'use client';

import { useRef, useState } from 'react';

type Product = {
	productId: number;
	name: string;
	price: number;
};

type Client = {
	clientId: number;
	name: string;
	consumed: Product[];
	totalToPay: number;
};

type Invoice = {
	products: Product[];
	totalPrice: number;
};

function Page() {
	const [clients, setClients] = useState<Client[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [invoice, setInvoice] = useState<Product[]>([]);
	const [isEditing, setIsEditing] = useState<number[]>([0, -1]);

	const productIdCounter = useRef<number>(0);
	const clientIdCounter = useRef<number>(0);

	const addClientInput = useRef<HTMLInputElement>(null);
	const addProductNameInput = useRef<HTMLInputElement>(null);
	const addProductPriceInput = useRef<HTMLInputElement>(null);

	function handleClientAdd() {
		if (addClientInput.current?.value) {
			const newClient: Client = {
				clientId: clientIdCounter.current,
				name: addClientInput.current.value,
				consumed: [],
				totalToPay: 0,
			};

			clientIdCounter.current += 1;

			addClientInput.current.value = '';

			setClients((previous) => [...previous, newClient]);
		}
	}

	function handleProductsAdd() {
		if (addProductNameInput.current?.value && addProductPriceInput.current?.value) {
			const newProduct: Product = {
				productId: productIdCounter.current,
				name: addProductNameInput.current.value,
				price: parseFloat(addProductPriceInput.current.value),
			};

			productIdCounter.current += 1;

			addProductNameInput.current.value = '';
			addProductPriceInput.current.value = '';

			setProducts((previous) => [...previous, newProduct]);
		}
	}

	function handleIsEditing(index: number) {
		setIsEditing((data) => [data[0] == 0 ? 1 : 0, index]);
	}

	function addProductToClient(client: Client, product: Product) {
		let newClients: Client[] = clients.slice(0);

		let newClient = newClients.find((data) => data == client);

		if (newClient) {
			newClient.consumed.push(product);
			newClient.totalToPay += product.price;

			setClients(newClients);
			setIsEditing([0, -1]);
		}
	}

	function calculateInvoice() {}

	return (
		<div className='grid grid-cols-3 gap-4 p-8'>
			<div className='flex flex-col gap-4 p-2 border border-white rounded-sm'>
				<h1 className='text-2xl font-bold'>Lista:</h1>
				<div className='h-full'>
					<h2>Clientes:</h2>
					<div className='flex flex-col h-40 border border-white py-2 overflow-y-auto scroll'>
						{clients.map((client, index) => (
							<div
								key={index}
								className='p-2 odd:border-y first:border-t-transparent last:border-b-transparent border-neutral-600'>
								<p className='pl-2 border-l border-neutral-800'>{client.name}</p>
								<div className='pl-2 border-l border-neutral-800'>
									{client.consumed.map((product, productIndex) => (
										<div key={`${index}-${productIndex}`} className='pl-2'>
											{product.name}
										</div>
									))}

									<button onClick={() => handleIsEditing(index)}>+</button>
									{isEditing[0] == 1 && isEditing[1] == index && (
										<div className='absolute inset-0 z-50 bg-black/70 flex justify-center items-center'>
											<div className='relative w-1/2 h-1/2 backdrop-blur-md flex flex-col gap-2 p-2 border border-white'>
												<button
													className='absolute right-2 top-0 w-2 h-2'
													onClick={() => handleIsEditing(index)}>
													x
												</button>
												<p className='text-center text-xl'>Adicionar produto para {client.name}</p>
												<div className='overflow-y-auto grid grid-cols-3 gap-2 mt-4'>
													{products.map((product, index) => {
														if (!client.consumed.includes(product)) {
															return (
																<button
																	key={index}
																	onClick={() => addProductToClient(client, product)}
																	className='relative p-2 border border-white'>
																	<p className='absolute text-sm left-1 top-0  text-slate-500'>
																		{product.productId}
																	</p>
																	<p>{product.name}</p>
																</button>
															);
														}
													})}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
					<h2>Produtos:</h2>
					<div className='flex flex-col gap-2 h-40 border border-white p-2 overflow-y-auto'>
						{products.map((product, index) => (
							<div key={index} className='relative pr-4 p-2 border border-white'>
								<p className='absolute text-sm right-1 top-0 text-slate-500'>{product.productId}</p>
								<div className='grid grid-cols-2'>
									<p>{product.name}:</p>
									<p className='flex justify-end'>R${product.price}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className='flex flex-col justify-evenly items-center gap-4 p-2 border border-white rounded-sm'>
				<div className='flex flex-col gap-2 w-full'>
					<label>Nome do Cliente</label>
					<input type='text' ref={addClientInput} className='p-2 bg-black border border-slate-600' />
					<button type='button' className='p-2 border border-white rounded-sm' onClick={handleClientAdd}>
						Adicionar
					</button>
				</div>
				<div className='flex flex-col gap-2 w-full'>
					<div className='flex'>
						<div className='flex flex-col w-1/2 gap-2'>
							<label>Nome do Produto</label>
							<input ref={addProductNameInput} className='p-2 bg-black border border-slate-600' />
						</div>
						<div className='flex flex-col w-1/2 gap-2'>
							<label>Preço do Produto</label>
							<input ref={addProductPriceInput} className='p-2 bg-black border border-slate-600' />
						</div>
					</div>
					<button type='button' className='p-2 border border-white rounded-sm' onClick={handleProductsAdd}>
						Adicionar
					</button>
				</div>
				<div className='flex justify-center gap-2 w-full'>
					<input type='checkbox' />
					<label>Adicionar taxa de 10%</label>
				</div>
				<button onClick={calculateInvoice} className='p-2 border border-white rounded-sm'>
					Calcular
				</button>
			</div>
			<div className='flex flex-col gap-4 p-2 border border-white rounded-sm'>
				<p className='text-2xl font-bold text-center'>Comanda</p>
				<div className='flex flex-col justify-between h-full p-2'>
					<div>
						<p className='border-b border-neutral-600'>Produtos:</p>
						<div className='flex justify-between text-neutral-700 mb-2'>
							<p>Nome</p>
							<p>Preço</p>
						</div>
						<div className='overflow-y-auto h-64'>
							{products.map((product, index) => (
								<div
									key={index}
									className='flex justify-between even:border-y border-dashed border-neutral-600'>
									<p>{product.name}</p>
									<p>R${product.price}</p>
								</div>
							))}
						</div>
					</div>
					<div className='flex justify-between'>
						<p>Total:</p>
						<p>R$ {products.reduce((previous, product) => previous + product.price, 0)}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Page;
