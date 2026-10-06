import httpx
import asyncio

async def main():
    for name in ['Lays Classic', 'Food Label', 'Oreo Cookies']:
        res = await httpx.AsyncClient().get('https://world.openfoodfacts.org/cgi/search.pl', params={'search_terms': name, 'search_simple': '1', 'action': 'process', 'json': '1'})
        data = res.json()
        prods = data.get('products', [])
        print(f'{name}: {len(prods)} products found. First: {prods[0].get("product_name") if prods else "None"}')

asyncio.run(main())
