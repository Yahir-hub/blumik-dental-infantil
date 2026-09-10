import urllib.request,pathlib,re,concurrent.futures
root='http://localhost:3001'
paths=['/','/servicios','/pacientes-neurodivergentes','/preguntas-frecuentes','/contacto']
def check(p):
 r=urllib.request.urlopen(root+p);s=r.read().decode();return (p,r.status,len(s))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 for x in ex.map(check,paths):print(x)
assets=list(pathlib.Path('public/assets').iterdir())
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 results=list(ex.map(lambda p:urllib.request.urlopen(urllib.request.Request(root+'/assets/'+urllib.parse.quote(p.name),method='HEAD')).status,assets))
print('Assets:',len(results),'OK:',sum(x==200 for x in results))
