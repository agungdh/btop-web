import { describe, it, expect } from 'vitest';
import { parseHosts } from './client';

describe('parseHosts', () => {
	it('falls back to local when empty or unset', () => {
		expect(parseHosts(undefined)).toEqual([{ baseUrl: '', label: 'local' }]);
		expect(parseHosts('')).toEqual([{ baseUrl: '', label: 'local' }]);
		expect(parseHosts('   ')).toEqual([{ baseUrl: '', label: 'local' }]);
	});

	it('parses a single host and normalizes the trailing slash', () => {
		expect(parseHosts('http://127.0.0.1:8080/')).toEqual([
			{ baseUrl: 'http://127.0.0.1:8080', label: '127.0.0.1:8080' }
		]);
	});

	it('adds a default scheme when missing', () => {
		expect(parseHosts('127.0.0.1:8080')).toEqual([
			{ baseUrl: 'http://127.0.0.1:8080', label: '127.0.0.1:8080' }
		]);
	});

	it('parses multiple hosts as csv', () => {
		expect(parseHosts('http://a:1, http://b:2')).toEqual([
			{ baseUrl: 'http://a:1', label: 'a:1' },
			{ baseUrl: 'http://b:2', label: 'b:2' }
		]);
	});

	it('extracts basic auth credentials and drops them from the url', () => {
		expect(parseHosts('http://admin:secret@host:8080')).toEqual([
			{
				baseUrl: 'http://host:8080',
				label: 'admin@host:8080',
				username: 'admin',
				password: 'secret'
			}
		]);
	});

	it('falls back to local when no valid entry remains', () => {
		expect(parseHosts('not a url,,')).toEqual([{ baseUrl: '', label: 'local' }]);
	});
});
