all: build

site.exe: site.hs
	ghc --make site.hs
	site.exe clean
	
build: site.exe
	site.exe build
	
preview: site.exe
	site.exe preview