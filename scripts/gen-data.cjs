const fs=require('fs');const d='../baruch-raw-tmp/';
const r=f=>JSON.parse(fs.readFileSync(d+f,'utf8').replace(/^\uFEFF/,''));
const v=r('vehicles.json'),im=r('vehicle_images.json'),cat=r('vehicle_categories.json');
const cm=Object.fromEntries(cat.map(c=>[c.id,c.name]));
const out=v.map(x=>({id:x.id,slug:x.slug,marca:x.marca.trim(),modelo:x.modelo.trim(),versao:(x.versao||'').trim(),
anoFab:x.ano_fabricacao,anoMod:x.ano_modelo,cor:x.cor,combustivel:x.combustivel,cambio:x.cambio,km:x.quilometragem,preco:x.preco,
status:x.status,opcionais:x.opcionais||[],descricao:x.descricao||'',destaque:!!x.destaque,entrada:x.data_entrada,
categoria:cm[x.categoria_id]||'',vistoriado:x.vistoriado,laudo:x.laudo_url,
imagens:im.filter(i=>i.vehicle_id===x.id).sort((a,b)=>a.display_order-b.display_order).map(i=>i.url)}));
fs.mkdirSync('src/data',{recursive:true});
fs.writeFileSync('src/data/vehicles.json',JSON.stringify(out,null,1));
console.log(out.length,out.map(o=>o.imagens.length).join(','),Object.keys(x=v[0]).join(','));
