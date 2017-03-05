clean:
	@echo '[Start Clean ...]'
	@rm -rf dist
	@rm -rf dev
	@mkdir dev
	@echo '[Clean Done .]'

fe: clean
	@echo '[Start Build FE ...]'
	@cp ./lib/fe/* ./dev/ || pwd
	@cp -a ./lib/fe/. ./dev/ || pwd
	@echo '[FE Environment Done .]'

node: clean
	@echo '[Start Build NODE ...]'
	@cp ./lib/node/* ./dev/ || pwd
	@cp -a ./lib/node/. ./dev/ || pwd
	@echo '[NODE Environment Done .]'

vue: clean
	@echo '[Start Build VUE ...]'
	@cp ./lib/vue/* ./dev/ || pwd
	@cp -a ./lib/vue/. ./dev/ || pwd
	@echo '[VUE Environment Done .]'