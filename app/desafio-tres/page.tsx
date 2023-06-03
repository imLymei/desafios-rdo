'use client';

import { useRef, useState } from 'react';
import setDecimals from '@/utils/setDecimals';
import { CgTrash } from 'react-icons/cg';
import { TbNoteOff } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';

type Product = {
	productId: number;
	name: string;
	price: number;
	divideTo: number;
};

type Client = {
	clientId: number;
	name: string;
	consumed: Product[];
};

function Page() {
	const [clients, setClients] = useState<Client[]>([]);
	const [products, setProducts] = useState<Product[]>([]);

	const [isEditing, setIsEditing] = useState<number[]>([0, -1]);
	const [isFormInClient, setIsFormInClient] = useState<boolean>(true);
	const [tenPercentPay, setTenPercentPay] = useState<Client[]>([]);
	const [tenPercentCheckButton, setTenPercentCheckButton] = useState<boolean>(false);

	const productIdCounter = useRef<number>(0);
	const clientIdCounter = useRef<number>(0);

	const addClientInput = useRef<HTMLInputElement>(null);
	const addProductNameInput = useRef<HTMLInputElement>(null);
	const addProductPriceInput = useRef<HTMLInputElement>(null);
	const addProductQuantityInput = useRef<HTMLInputElement>(null);

	function handleClientAdd() {
		if (addClientInput.current?.value) {
			const newClient: Client = {
				clientId: clientIdCounter.current,
				name: addClientInput.current.value,
				consumed: [],
			};

			clientIdCounter.current += 1;

			addClientInput.current.value = '';

			setClients((previous) => [...previous, newClient]);
		}
	}

	function handleProductsAdd() {
		if (addProductNameInput.current && addProductPriceInput.current && addProductQuantityInput.current) {
			let productsToAdd: Product[] = [];

			for (let i = 0; i < parseInt(addProductQuantityInput.current.value); i++) {
				productsToAdd.push({
					productId: productIdCounter.current,
					name: addProductNameInput.current.value,
					price: parseFloat(addProductPriceInput.current.value),
					divideTo: 0,
				});

				productIdCounter.current += 1;
			}

			addProductNameInput.current.value = '';
			addProductPriceInput.current.value = '';
			addProductQuantityInput.current.value = '1';

			setProducts((previous) => [...previous, ...productsToAdd]);
		}
	}

	function handleIsEditing(index: number) {
		setIsEditing((data) => [data[0] == 0 ? 1 : 0, index]);
	}

	function addProductToClient(client: Client, product: Product) {
		let newClients: Client[] = clients.slice(0);
		let newProducts: Product[] = products.slice(0);

		let newClient = newClients.find((data) => data == client);
		let newProduct = newProducts.find((data) => data == product);

		if (newClient && newProduct) {
			newClient.consumed.push(product);
			newProduct.divideTo += 1;

			setClients(newClients);
			setProducts(newProducts);
			setIsEditing([0, -1]);
		}
	}

	function deleteProduct(productIdToDelete: number) {
		let newProducts = products.slice(0).filter((product) => product.productId != productIdToDelete);
		let newClients = clients.slice(0);

		newClients.map((client, index) => {
			newClients[index].consumed = client.consumed.filter(
				(product) => product.productId != productIdToDelete
			);
		});

		setProducts(newProducts);
		setClients(newClients);
	}

	function deleteClient(clientIdToDelete: number) {
		let newClients = clients.slice(0).filter((client) => client.clientId != clientIdToDelete);
		let newProducts = products.slice(0);
		let newTenPercentPay = tenPercentPay.slice(0).filter((client) => client.clientId != clientIdToDelete);

		newProducts.map((product, index) => {
			if (clients.find((client) => client.clientId == clientIdToDelete)?.consumed.includes(product)) {
				newProducts[index].divideTo -= 1;
			}
		});

		setClients(newClients);
		setTenPercentPay(newTenPercentPay);
	}

	function removeConsumed(clientParam: Client, productParam: Product) {
		let newClients = clients.slice(0);
		let newProducts = products.slice(0);

		let newClient = newClients.find((client) => client == clientParam);
		let newProduct = newProducts.find((product) => product == productParam);

		if (newClient && newProduct) {
			newClient.consumed = newClient.consumed.filter((product) => product != productParam);
			newProduct.divideTo -= 1;

			setClients(newClients);
			setProducts(newProducts);
		}
	}

	function ClientForm() {
		return (
			<div className='flex flex-col border gap-2 border-white p-2 overflow-y-auto scroll h-full'>
				<h2 className=''>Clientes:</h2>
				{clients.map((client, index) => (
					<div key={client.clientId} className='p-2 border border-white'>
						<div className='relative'>
							<p className='pl-2 border-l border-neutral-800'>{client.name}</p>
							<div
								className={`absolute top-0 left-1/2 -translate-x-1/2 flex gap-2 ${
									tenPercentCheckButton ? '' : 'hidden'
								}`}>
								<input
									disabled={!tenPercentCheckButton}
									checked={tenPercentPay.includes(client)}
									onChange={(e) => {
										tenPercentPay.includes(client)
											? setTenPercentPay((data) => data.filter((filterClient) => filterClient != client))
											: setTenPercentPay((data) => [...data, client]);
									}}
									id={`${client.clientId}IsPayingTax`}
									type='checkbox'
								/>
								<label htmlFor={`${client.clientId}IsPayingTax`}>Vai pagar a taxa</label>
							</div>
							<button
								onClick={() => deleteClient(client.clientId)}
								className='absolute right-0 top-0 transition hover:text-slate-400'>
								<CgTrash size={20} />
							</button>
						</div>
						<div className='pl-2 border-l border-neutral-800'>
							{client.consumed.map((product, productIndex) => (
								<div key={`${index}-${productIndex}`} className='px-2 flex justify-between'>
									<p>{product.name}</p>
									<button
										onClick={() => removeConsumed(client, product)}
										className='transition hover:text-slate-400'>
										<TbNoteOff />{' '}
									</button>
								</div>
							))}

							<button onClick={() => handleIsEditing(index)} className='px-2 transition hover:text-slate-400'>
								+
							</button>
							{isEditing[0] == 1 && isEditing[1] == index && (
								<div className='absolute inset-0 z-50 bg-black/70 flex justify-center items-center'>
									<div className='relative w-1/2 h-1/2 backdrop-blur-md flex flex-col gap-2 p-2 border border-white'>
										<button className='absolute right-2 top-0 w-2 h-2' onClick={() => handleIsEditing(index)}>
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
															className='relative p-2 border border-white transition group hover:bg-white/5'>
															<p className='absolute text-sm left-1 top-0 text-slate-500'>
																{product.productId}
															</p>
															<p className='transition group-hover:scale-105 group-hover:animate-pulse'>
																{product.name}
															</p>
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
		);
	}

	function ProductsForm() {
		return (
			<div className='flex flex-col gap-2 border border-white p-2 overflow-y-auto h-full'>
				<h2 className=''>Produtos:</h2>
				{products.map((product, index) => (
					<div key={index} className='relative pr-10 p-2 border border-white'>
						<p className='absolute text-xs right-1 top-0 text-slate-500'>{product.productId}</p>
						<div className='grid grid-cols-2'>
							<p>{product.name}:</p>
							<p className='flex justify-end'>R${setDecimals(product.price, 2)}</p>
						</div>
						<button
							onClick={() => deleteProduct(product.productId)}
							className='absolute right-3 top-1/2 -translate-y-1/2'>
							<CgTrash size={20} />
						</button>
					</div>
				))}
			</div>
		);
	}

	function AddForms() {
		return (
			<div className='flex flex-col h-full justify-evenly items-center gap-4 p-2 border border-white rounded-sm'>
				<p className='text-2xl font-bold'>Formulário:</p>
				<div className='flex flex-col gap-2 w-full'>
					<label>Nome do Cliente</label>
					<input
						type='text'
						ref={addClientInput}
						className='p-2 bg-black border border-slate-600 focus:border-white outline-none'
						placeholder='Lucas Aliar'
					/>
					<button type='button' className='p-2 border border-white rounded-sm' onClick={handleClientAdd}>
						Adicionar
					</button>
				</div>
				<div className='flex flex-col gap-2 w-full'>
					<div className='flex'>
						<div className='flex flex-col w-1/2 gap-2'>
							<label>Nome do Produto</label>
							<input
								ref={addProductNameInput}
								className='p-2 bg-black border border-slate-600 focus:border-white rounded-l-sm outline-none'
								placeholder='Coca-Cola'
							/>
						</div>
						<div className='flex flex-col w-1/2 gap-2'>
							<label>Preço do Produto</label>
							<input
								ref={addProductPriceInput}
								className='p-2 bg-black border border-slate-600 focus:border-white outline-none'
								placeholder='5.99'
							/>
						</div>
						<div className='flex flex-col w-1/2 gap-2'>
							<label>Quantidade</label>
							<input
								ref={addProductQuantityInput}
								type='number'
								min={1}
								max={100}
								defaultValue={'1'}
								className='p-2 bg-black border border-slate-600 focus:border-white rounded-r-sm outline-none'
								placeholder='5'
							/>
						</div>
					</div>
					<button type='button' className='p-2 border border-white rounded-sm' onClick={handleProductsAdd}>
						Adicionar
					</button>
				</div>
				<div className='flex justify-center gap-2 w-full'>
					<input
						checked={tenPercentCheckButton}
						onChange={(e) => setTenPercentCheckButton(e.target.checked)}
						type='checkbox'
						id='tenPercentCheckButton'
					/>
					<label htmlFor='tenPercentCheckButton'>Adicionar taxa de 10%</label>
				</div>
			</div>
		);
	}

	function InvoicePage() {
		return (
			<div className='flex flex-col overflow-y-auto gap-4 px-[15%] py-12 border border-white rounded-sm'>
				<p className='text-2xl font-bold text-center'>Comanda</p>
				<div className='flex flex-col gap-4 justify-between p-2'>
					<div>
						<p className='border-b border-neutral-600 font-semibold'>Produtos:</p>
						<div className='flex justify-between text-neutral-700 mb-2'>
							<p>Nome</p>
							<p>Preço</p>
						</div>
						<div className='overflow-y-auto'>
							{products.map((product, index) => (
								<div
									key={index}
									className='flex justify-between even:border-y first:border-t-transparent last:border-b-transparent border-dashed border-neutral-600'>
									<p>{product.name}</p>
									<p>R${setDecimals(product.price, 2)}</p>
								</div>
							))}
						</div>
					</div>

					<div className='flex flex-col'>
						<p className='border-b border-neutral-600 font-semibold'>Total por Pessoa:</p>
						<div className='flex justify-between text-neutral-700 mb-2'>
							<p>Nome</p>
							<p>Preço a Pagar</p>
						</div>
						{clients.map((client, index) => (
							<div
								key={index}
								className='flex justify-between even:border-y first:border-t-transparent last:border-b-transparent border-dashed border-neutral-600'>
								<p>{client.name}:</p>
								<p>
									R${' '}
									{tenPercentCheckButton
										? setDecimals(
												client.consumed.reduce(
													(previous, product) => previous + product.price / product.divideTo,
													0
												) * (tenPercentPay.includes(client) ? 1.1 : 1),
												2
										  )
										: setDecimals(
												client.consumed.reduce(
													(previous, product) => previous + product.price / product.divideTo,
													0
												),
												2
										  )}
								</p>
							</div>
						))}
					</div>
					<div className='flex flex-col'>
						<div className='flex justify-between font-semibold'>
							<p>Sobra:</p>
							<p>
								R${' '}
								{setDecimals(
									products.reduce(
										(previous, product) => (product.divideTo != 0 ? previous : previous + product.price),
										0
									),
									2
								)}
							</p>
						</div>
						<div
							className={`relative flex justify-between font-semibold ${
								tenPercentCheckButton && tenPercentPay.length == 0 ? 'text-red-500' : ''
							}`}>
							<p>Taxa:</p>
							<p>
								R${' '}
								{tenPercentCheckButton
									? setDecimals(products.reduce((previous, product) => previous + product.price, 0) * 0.1, 2)
									: '0'}
							</p>
							<div
								className={`absolute -right-6 top-1/2 -translate-y-1/2 ${
									tenPercentCheckButton && tenPercentPay.length == 0 ? '' : 'hidden'
								}`}>
								<p className='text-xs w-4 h-4 flex justify-center items-center transition-all duration-300 rounded-xl hover:rounded-sm border border-red-500 peer cursor-default'>
									?
								</p>
								<div className='absolute top-6 right-2 translate-x-1/2 transition-all scale-0 peer-hover:scale-100 origin-top p-2 border border-red-500 bg-black/70 text-xs'>
									<p>Ninguém está pagando a taxa!</p>
								</div>
							</div>
						</div>
						<div className='flex justify-between font-semibold'>
							<p>Total:</p>
							<p>
								R${' '}
								{tenPercentCheckButton
									? setDecimals(products.reduce((previous, product) => previous + product.price, 0) * 1.1, 2)
									: setDecimals(
											products.reduce((previous, product) => previous + product.price, 0),
											2
									  )}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 sm:grid-cols-3 grid-rows-3 sm:grid-rows-1 gap-4 p-8 h-[1800px] sm:h-[800px]'>
			<AddForms />
			<div className='h-full flex flex-col gap-4 p-2 border border-white rounded-sm'>
				<p className='flex justify-center items-center text-2xl font-bold'>Lista:</p>

				<div className='flex flex-col flex-auto'>
					<div className='flex gap-2 overflow-hidden'>
						<button
							onClick={() => setIsFormInClient(true)}
							className={`p-2 border border-white border-b-transparent rounded-t-sm transition-all ${
								isFormInClient ? 'translate-y-0' : 'translate-y-2'
							}`}>
							Clientes
						</button>
						<button
							onClick={() => setIsFormInClient(false)}
							className={`p-2 border border-white border-b-transparent rounded-t-sm transition-all ${
								isFormInClient ? 'translate-y-2' : 'translate-y-0'
							}`}>
							Produtos
						</button>
					</div>
					<div className='h-[62%] sm:h-[600px]'>{isFormInClient ? <ClientForm /> : <ProductsForm />}</div>
				</div>
			</div>
			<InvoicePage />
		</div>
	);
}

export default Page;
