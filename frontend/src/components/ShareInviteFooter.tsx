import { QRCodeSVG } from 'qrcode.react'

interface ShareInviteFooterProps {
  url: string
  message?: string
}

const DEFAULT_MESSAGE = '我正在做 FBIT 钓鱼人格测试，你也来试试吧'

function ShareInviteFooter({ url, message = DEFAULT_MESSAGE }: ShareInviteFooterProps) {
  return (
    <section className="share-invite-footer" aria-label="分享引导">
      <div className="share-invite-footer__copy">
        <span className="content-label">扫码测试</span>
        <p>{message}</p>
        <span className="share-invite-footer__url">{url}</span>
      </div>

      <div className="share-invite-footer__qr" aria-hidden="true">
        <QRCodeSVG
          value={url}
          size={148}
          bgColor="transparent"
          fgColor="#24302b"
          marginSize={1}
          level="M"
        />
      </div>
    </section>
  )
}

export default ShareInviteFooter
