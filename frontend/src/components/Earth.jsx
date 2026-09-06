import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

export default function Earth({
  className = '',
  theta = 0.25,
  dark = 1,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 16000,
  mapBrightness = 6,
  baseColor = [0.19, 0.44, 0.93],
  markerColor = [1, 0.42, 0.42],
  glowColor = [0.29, 0.51, 0.85],
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let width = 0
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener('resize', onResize)
    onResize()
    let phi = 0

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta,
      dark,
      scale,
      diffuse,
      mapSamples,
      mapBrightness,
      baseColor,
      markerColor,
      glowColor,
      opacity: 1,
      offset: [0, 0],
      markers: [],
    })

    let animationFrameId
    const animate = () => {
      phi += 0.012
      globe.update({ phi })
      animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationFrameId)
      globe.destroy()
    }
  }, [theta, dark, scale, diffuse, mapSamples, mapBrightness, baseColor, markerColor, glowColor])

  return (
    <div className={`z-10 mx-auto flex w-full max-w-[520px] items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: '100%', aspectRatio: '1' }}
      />
    </div>
  )
}
