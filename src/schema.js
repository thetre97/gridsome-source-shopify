export const createSchema = ({ addSchemaTypes, schema, addSchemaResolvers, IMAGE_TYPENAME }) => {
  addSchemaTypes([
    schema.createEnumType({
      name: `${IMAGE_TYPENAME}CropMode`,
      values: {
        CENTER: {},
        TOP: {},
        LEFT: {},
        BOTTOM: {},
        RIGHT: {}
      }
    }),
    schema.createObjectType({
      name: IMAGE_TYPENAME,
      interfaces: ['Node'],
      fields: {
        altText: 'String',
        originalSrc: 'String',
        transformedSrc: 'String'
      }
    })
  ])
  addSchemaResolvers({
    [ IMAGE_TYPENAME ]: {
      transformedSrc: {
        args: {
          maxWidth: 'Int',
          maxHeight: 'Int',
          crop: `${IMAGE_TYPENAME}CropMode`,
          scale: 'Int'
        },
        resolve ({ originalSrc }, { maxHeight, maxWidth, crop, scale }) {
          // Create the transform for Shopif CDN
          const dot = originalSrc.lastIndexOf('.')
          const path = originalSrc.slice(0, dot)
          const ext = originalSrc.slice(dot)
          const transforms = []

          if (maxWidth && maxHeight) transforms.push(`_${maxWidth}x${maxHeight}`)
          else if (maxWidth) transforms.push(`_${maxWidth}x`)
          else if (maxHeight) transforms.push(`_x${maxHeight}`)

          if (crop && (maxWidth || maxHeight)) transforms.push(`_crop_${crop.toLowerCase()}`)
          if (scale && scale !== 1) transforms.push(`@${scale}x`)

          const transformedSrc = `${path}${transforms.join('')}${ext}`
          return transformedSrc
        }
      }
    }
  })
}