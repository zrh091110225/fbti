export interface TagPalette {
  paperBg: string
  paperBorder: string
  paperText: string
  mistBg: string
  mistBorder: string
  mistText: string
  nightBg: string
  nightBorder: string
  nightText: string
  canvasBg: string
  canvasBorder: string
  canvasText: string
}

const tagPalettes: TagPalette[] = [
  {
    paperBg: 'rgba(158, 184, 157, 0.18)',
    paperBorder: 'rgba(95, 126, 98, 0.24)',
    paperText: '#41584a',
    mistBg: 'rgba(158, 184, 157, 0.14)',
    mistBorder: 'rgba(95, 126, 98, 0.18)',
    mistText: '#53675c',
    nightBg: 'rgba(168, 198, 171, 0.18)',
    nightBorder: 'rgba(191, 221, 194, 0.24)',
    nightText: '#d8ead9',
    canvasBg: 'rgba(168, 198, 171, 0.22)',
    canvasBorder: 'rgba(95, 126, 98, 0.24)',
    canvasText: '#41584a'
  },
  {
    paperBg: 'rgba(150, 177, 195, 0.18)',
    paperBorder: 'rgba(91, 120, 140, 0.24)',
    paperText: '#405464',
    mistBg: 'rgba(150, 177, 195, 0.14)',
    mistBorder: 'rgba(91, 120, 140, 0.18)',
    mistText: '#536574',
    nightBg: 'rgba(153, 184, 209, 0.18)',
    nightBorder: 'rgba(184, 214, 234, 0.24)',
    nightText: '#d7e6f1',
    canvasBg: 'rgba(153, 184, 209, 0.22)',
    canvasBorder: 'rgba(91, 120, 140, 0.24)',
    canvasText: '#405464'
  },
  {
    paperBg: 'rgba(206, 188, 142, 0.2)',
    paperBorder: 'rgba(145, 122, 70, 0.24)',
    paperText: '#64502f',
    mistBg: 'rgba(206, 188, 142, 0.16)',
    mistBorder: 'rgba(145, 122, 70, 0.18)',
    mistText: '#77613f',
    nightBg: 'rgba(206, 188, 142, 0.18)',
    nightBorder: 'rgba(226, 208, 162, 0.24)',
    nightText: '#f0e3be',
    canvasBg: 'rgba(206, 188, 142, 0.24)',
    canvasBorder: 'rgba(145, 122, 70, 0.24)',
    canvasText: '#64502f'
  },
  {
    paperBg: 'rgba(191, 157, 164, 0.18)',
    paperBorder: 'rgba(132, 96, 104, 0.24)',
    paperText: '#62464d',
    mistBg: 'rgba(191, 157, 164, 0.14)',
    mistBorder: 'rgba(132, 96, 104, 0.18)',
    mistText: '#76585f',
    nightBg: 'rgba(198, 168, 176, 0.18)',
    nightBorder: 'rgba(226, 198, 205, 0.24)',
    nightText: '#eddce0',
    canvasBg: 'rgba(198, 168, 176, 0.22)',
    canvasBorder: 'rgba(132, 96, 104, 0.24)',
    canvasText: '#62464d'
  },
  {
    paperBg: 'rgba(172, 171, 190, 0.18)',
    paperBorder: 'rgba(111, 112, 140, 0.24)',
    paperText: '#4e4f69',
    mistBg: 'rgba(172, 171, 190, 0.14)',
    mistBorder: 'rgba(111, 112, 140, 0.18)',
    mistText: '#60617a',
    nightBg: 'rgba(180, 181, 210, 0.18)',
    nightBorder: 'rgba(204, 206, 231, 0.24)',
    nightText: '#dfe0f3',
    canvasBg: 'rgba(180, 181, 210, 0.22)',
    canvasBorder: 'rgba(111, 112, 140, 0.24)',
    canvasText: '#4e4f69'
  }
]

export function getTagPalette(index: number): TagPalette {
  return tagPalettes[((index % tagPalettes.length) + tagPalettes.length) % tagPalettes.length]
}
