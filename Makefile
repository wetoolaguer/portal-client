REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter list --timeout 1000

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		--watch

.PHONY: test test-w
