const H   = t => t.getHours()
const M   = t => t.getMinutes()
const S   = t => t.getSeconds()
const SEC = t => S(t) + M(t) * 60 + H(t) * 3600
const MIL = t => SEC(t) * 1000 + t.getMilliseconds()
const F   = n => n.toString().padStart(2, '0')
const D1  = n => Math.floor(n / 10)
const D2  = n => n % 10
const DAY = 86400

export function normal(target) {
	return t => {
		target.innerHTML = F(H(t)) + ':' + F(M(t)) + ':' + F(S(t))
	}
}

export function inverse(target) {
	return t => {
		const i = DAY - SEC(t)
		const h = Math.floor(i / 3600) % 24
		const m = Math.floor(i / 60) % 60
		const s = i % 60
		target.innerHTML = F(h) + ':' + F(m) + ':' + F(s)
	}
}

export function percent(target) {
	return t => {
		const p = SEC(t) / DAY * 100
		target.innerHTML = p.toFixed(2) + '%'
	}
}

export function seconds(target) {
	return t => {
		target.innerHTML = SEC(t)
	}
}

export function roman(target) {
	function r(num) {
		const map = {L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1}
		let out = ''
		for (const i in map ) {
			while ( num >= map[i] ) {
				out += i
				num -= map[i]
			}
		}
		if (out === '') return ' '
		return out
	}
	return t => {
		target.innerHTML = r(H(t)) + '·' + r(M(t)) + '·' + r(S(t))
	}
}

export function degrees(target) {
	return t => {
		const s = Math.round((S(t) * 1000 + t.getMilliseconds()) / 60000 * 360)
		const m = Math.round((M(t) / 60 + S(t) / 3600) * 360)
		const h = Math.round((H(t) % 12 / 12 + M(t) / 1440 + S(t) / DAY) * 360)
		let out = ''
		out += h.toString().padStart(3, ' ') + '°'
		out += m.toString().padStart(3, ' ') + '°'
		out += s.toString().padStart(3, ' ') + '°'
		target.innerHTML = out
	}
}

export function clock(target) {
	const KEY = 'alarm'

	const alarm = JSON.parse(localStorage.getItem(KEY)) || {h:7, m:0}

	let out = ''
	out += '<span class="btn h">'+F(alarm.h)+'</span>'
	out += ':'
	out += '<span class="btn m">'+F(alarm.m)+'</span>'
	out += '<span class="clock">•</span>'
	target.innerHTML = out

	target.querySelectorAll('.btn').forEach(el => {
		el.style.cursor = 'pointer'
		el.style.webkitTouchCallout = 'none'
		el.style.webkitUserSelect = 'none'
		el.addEventListener('mousedown', e => {
			const position = el.classList.contains('h') ? 'h' : 'm'
			const v = parseInt(e.target.innerText)
			const m = position == 'h' ? 24 : 60
			const set = F((v + 1) % m)
			e.target.innerText = set
			alarm[position] = set

			localStorage.setItem(KEY, JSON.stringify(alarm))
		})
	})

	return t => {
		const sh = parseInt(target.querySelector('.btn.h').innerText)
		const sm = parseInt(target.querySelector('.btn.m').innerText)
		const clock = target.querySelector('.clock')
		if (sh == H(t) && sm == M(t)) {
			clock.innerText = '•'.padEnd(Math.floor(MIL(t) / 100) % 4 + 1, ')')
		} else {
			clock.innerText = '•'
		}
	}
}

export function cuckoo(target, pari=1) {

	const frames = [
		'-',
		'o-',
		'\\o-',
		'/\\o-',
		'\\/\\o-',
		'/\\/\\o-',
		'\\/\\/\\o-',
		'/\\/\\/\\o-',
		'/\\/\\/\\o<',
		'/\\/\\/\\o<',
		'/\\/\\/\\o<',
		'/\\/\\/\\o<',
		'/\\/\\/\\o<',
		'/\\/\\/\\o-',
		'\\/\\/\\o-',
		'\\/\\o-',
		'/\\o-',
		'\\o-',
		'o-',
		'-',
		'',
		'',
		'',
		'',
		'',
		'',
	]

	let playCount = 0
	let animationFrame = 0
	let frame = 0

	target.style.cursor = 'pointer'
	target.style.webkitTouchCallout = 'none'
	target.style.webkitUserSelect = 'none'
	target.addEventListener('mousedown', e => {
		if (playCount == 0) playCount = 1
	})

	return (t, frame) => {
		const h = H(t)
		const m = M(t)
		const s = S(t)

		target.innerHTML = F(h) + ':' + F(m) + ':' + F(s)

		if (s == 0 && m == 30) {
			playCount = 1
		} else if (s == 0 && m == 0) {
			playCount = h
		}

		if (playCount > 0) {
			target.innerHTML += frames[animationFrame]
			if (frame % 4 == 0) {
				animationFrame++
				if (animationFrame == frames.length) {
					playCount--
					animationFrame = 0
				}
			}
		}
	}
}

export function even(target, ev=0) {
	return t => {
		const h = H(t) % 2 == ev ? F(H(t)) : '  '
		const m = M(t) % 2 == ev ? F(M(t)) : '  '
		const s = S(t) % 2 == ev ? F(S(t)) : '  '
		target.innerHTML = h + ':' + m + ':' + s
	}
}

export function odd(target) {
	return even(target, 1)
}

export function sort(target) {
	return t => {
		const a = [F(H(t)), F(M(t)), F(S(t))].sort() // Sorts alphabetically
		target.innerHTML = a[0] + ':' + a[1] + ':' + a[2]
	}
}

export function random(target) {

	function shuffle(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			const t = arr[i]
			arr[i] = arr[j]
			arr[j] = t
		}
	}

	const arr = []
	let idx = 0
	for (let s=0; s<60; s++){
		for (let m=0;m<60;m++){
			for (let h=0; h<24; h++){
				arr[idx++] = F(h) + ':' + F(m) + ':' + F(s)
			}
		}
	}

	idx = 0
	let ps = -1

	return t => {
		if (ps != S(t)) {
			ps = S(t)
			if (idx == 0) shuffle(arr)
			const h = Math.floor(Math.random()*24)
			const m = Math.floor(Math.random()*60)
			const s = Math.floor(Math.random()*60)
			target.innerHTML = arr[idx]
			idx = (idx + 1) % arr.length
		}
	}
}

export function sum1(target) {
	return t => {
		target.innerHTML = H(t) + M(t) + S(t)
	}
}

export function sum2(target) {
	return t => {
		let s = 0
		s += D1(H(t))
		s += D2(H(t))
		s += D1(M(t))
		s += D2(M(t))
		s += D1(S(t))
		s += D2(S(t))
		target.innerHTML = s
	}
}

export function emoji(target) {
	return t => {
		let i = H(t) % 12 * 2
		if (M(t) > 45) i = (i + 2) % 24
		else if (M(t) > 15 && M(t) <= 45) i = i + 1
		target.innerHTML = ['🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕡','🕖','🕢','🕗','🕣','🕘','🕤','🕙','🕥','🕚','🕦'][i]
	}
}

export function natural(target) {
	return t => {
		const m = Math.floor(M(t) / 15)
		const h = H(t)

		let out = h == 0 ? 'Midnight ' : h
		if      (m == 1) out += '¼'
		else if (m == 2) out += '½'
		else if (m == 3) out += '¾'

		target.innerHTML = out
	}
}

export function line(target) {
	return t => {
		let l = new Array(60).fill('.')
		l[H(t)] = ' '
		if (M(t) == S(t)) {
			l[S(t)] = ';'
		} else if (H(t) == S(t)) {
			l[M(t)] = ','
			l[S(t)] = '·'
		} else {
			l[M(t)] = ','
			l[S(t)] = ':'
		}
		target.innerHTML = l.join('')
	}
}

export function mechanical(target) {
	return t => {
		const cols = 8
		const rows = 19
		let m = []
		for (let j=0; j<rows; j++) {
			m.push(new Array(cols).fill(' '))
		}

		function setCol(x, y, len) {
			for (let i=0; i<len; i++){
				m[y+i][x] = i
			}
		}

		setCol(0, 9 - D1(H(t)),  3)
		setCol(1, 9 - D2(H(t)), 10)
		m[9][2] = ':'
		setCol(3, 9 - D1(M(t)),  6)
		setCol(4, 9 - D2(M(t)), 10)
		m[9][5] = ':'
		setCol(6, 9 - D1(S(t)),  6)
		setCol(7, 9 - D2(S(t)), 10)

		let out = ''
		for (let j=0; j<rows; j++){
			for (let i=0; i<cols; i++){
				out += m[j][i]
			}
			out += "<br>"
		}
		target.innerHTML = out
	}
}

export function prime(target) {

	function isPrime(n) {
		if (isNaN(n) || !isFinite(n) || n % 1 || n<2) return false
		if (n % 2 == 0) return n == 2
		if (n % 3 == 0) return n == 3
		const m = Math.sqrt(n)
		for (let i=5; i<=m; i+=6) {
			if (n%i==0)     return false
			if (n%(i+2)==0) return false
		}
		return true
	}

	return t => {
		const num = parseInt(F(H(t)) + F(M(t)) + F(S(t)))
		if (isPrime(num)) {
			target.innerHTML = F(H(t)) + ':' + F(M(t)) + ':' + F(S(t))
		} else {
			target.innerHTML = '  :  :  '
		}
	}
}

export function special(target) {

	function isSpecial(x,y,z) {

		if (x==y && y==z) return true

		if (x[0]==z[1] && x[1]==z[0] && y[0] == y[1]) return "Palindrome!"

		if (x[0]==x[1] && y[0]==y[1] && z[0] == z[1]) return true

		if (x[0]==x[1] && x[1]==y[0] && y[1] == z[0] && z[0] == z[1]) return true

		if (x[0]==y[1] && x[1]==z[0] && y[0] == z[1]) return true

		if (x[0]==y[1] && x[0] == z[0] && x[1] == y[0] && x[1] == z[1]) return true

		const nx = parseInt(x)
		const ny = parseInt(y)
		const nz = parseInt(z)
		if (nz == ny + 1 && ny == nx + 1) return true

		if (nz == ny - 1 && ny == nx - 1) return true

		if (x == '12' && y == '34' && z == '56') return "Straight Flush!"

		if (x == '01' && y == '23' && z == '45') return "Straight Flush!"

		return false
	}

	return t => {
		const r = isSpecial(F(H(t)), F(M(t)), F(S(t)))
		if (r === false) {
			target.innerHTML = '  :  :  '
		} else {
			target.innerHTML = F(H(t)) + ':' + F(M(t)) + ':' + F(S(t))
		}
	}
}

export function morse(target) {
	const code = [
		'−−−−−',
		'·−−−−',
		'··−−−',
		'···−−',
		'····−',
		'·····',
		'−····',
		'−−···',
		'−−−··',
		'−−−−·',
	]

	return t => {
		const h = F(H(t))
		const m = F(M(t))
		const s = F(S(t))

		let out = ''
		out += code[D1(H(t))] + ' '
		out += code[D2(H(t))] + '/'
		out += code[D1(M(t))] + ' '
		out += code[D2(M(t))] + '/'
		out += code[D1(S(t))] + ' '
		out += code[D2(S(t))]

		target.innerHTML = out
	}
}

export function lucky(target) {
	const unlucky = [
		4,
		9,
		13,
		17,
		39
	]

	return t => {
		const h = H(t)
		const m = M(t)
		const s = S(t)
		let out = ''
		out += (unlucky.indexOf(h) == -1 ? F(h) : '  ') + ':'
		out += (unlucky.indexOf(m) == -1 ? F(m) : '  ') + ':'
		out += unlucky.indexOf(s) == -1 ? F(s) : '  '
		target.innerHTML = out
	}
}

export function ampm(target) {
	return t => {
		target.innerHTML = H(t) < 12 ? 'AM' : 'PM'
	}
}

export function inequality(target) {
	return t => {
		const h = H(t)
		const m = M(t)
		const s = S(t)
		const a = h < m ? '<' : h > m ? '>' : '='
		const b = m < s ? '<' : m > s ? '>' : '='
		target.innerHTML = F(h) + a + F(m) + b + F(s)
	}
}

export function leet(target) {
	return t => {
		const h = F(H(t))
		const m = F(M(t))
		const s = F(S(t))

		const leet = 'OIZE4SG/Bq'

		let out = ''
		out += leet[parseInt(h[0])]
		out += leet[parseInt(h[1])]
		out += ':'
		out += leet[parseInt(m[0])]
		out += leet[parseInt(m[1])]
		out += ':'
		out += leet[parseInt(s[0])]
		out += leet[parseInt(s[1])]

		target.innerHTML = out
	}
}

export function hiroshima(target) {
	return t => {
		target.innerHTML = '??:??'
	}
}
