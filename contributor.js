const interval = 0.5
let translations

const getTranslations = async _ => {
    let i18nIndex = await fetch('data/contributor/i18n/index.json').then(res => res.json())
    let fallback = i18nIndex.fallback, main = i18nIndex.languages.filter(x => x.id.indexOf(navigator.language) != -1)?.[0]?.file ?? fallback
    let fallbackFile = await fetch(`data/contributor/i18n/${fallback}.json`).then(res => res.json())
    let mainFile = await fetch(`data/contributor/i18n/${main}.json`).then(res => res.json())
    translations = { ...fallbackFile, ...mainFile }
}

const resolve = key => translations[key] ?? key

window.onload = async _ => {
    await getTranslations()
    let contributor = await fetch('data/contributor/index.json').then(res => res.json())
    let delay = 0

    let t = document.createElement('h1')
    t.className = 'fade-line'
    t.style.animationDelay = `${delay}s`
    t.innerText = resolve('title.main')
    document.body.appendChild(t)
    delay += interval

    for (let { name, people } of contributor) {
        let title = document.createElement('h2')
        title.className = 'fade-line'
        title.style.animationDelay = `${delay}s`
        title.innerText = resolve(name)
        document.body.appendChild(title)
        delay += interval

        let p = document.createElement('div')
        p.className = 'container'
        document.body.appendChild(p)

        for (let { name, role, image } of people) {
            let single = document.createElement('div')
            single.className = 'fade-line single'
            single.style.animationDelay = `${delay}s`
            p.appendChild(single)

            let header = document.createElement('div')
            header.className = 'single-header'
            single.appendChild(header)

            let img = document.createElement('img')
            img.src = image
            img.title = resolve(name)
            header.appendChild(img)

            let h3 = document.createElement('h3')
            h3.innerText = resolve(name)
            header.appendChild(h3)

            if (role) {
                let r = document.createElement('p')
                r.innerText = resolve(role)
                single.appendChild(r)
            }
        }

        delay += interval
    }
}