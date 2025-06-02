import React, { useState } from 'react'
import { COLORS, FONT_SIZES, BUTTON_STYLES } from '../../../constants/ui'
import { GameCard } from './GameCard'
import type { Card } from '../../../../game/types'

interface TutorialProps {
  onClose: () => void
}

// Sample cards for demonstration - using actual game cards with images
const sampleProduct: Card = {
  id: 'minimalist_planner_pdf',
  name: 'Minimalist Planner PDF',
  cost: 1,
  type: 'Product',
  text: 'Declutter your day, digitally.',
  effect: 'minimalist_planner_sale',
  revenuePerSale: 1000,
  inventory: 5,
  keywords: [],
  flavor: 'Because your to-do list deserves better than sticky notes.'
}

const sampleTool: Card = {
  id: 'aa2',
  name: 'Optimize Checkout',
  cost: 2,
  type: 'Tool',
  text: 'Your Products sell for $1000 more.',
  effect: 'optimize_checkout',
  keywords: ['Conversion', 'Product'],
  flavor: 'One-click to success.'
}

const sampleEmployee: Card = {
  id: 'aa10',
  name: 'Technical Cofounder',
  cost: 3,
  type: 'Employee',
  text: 'Your Tools cost 1 less.',
  effect: 'technical_cofounder',
  keywords: ['Efficiency', 'Support'],
  flavor: 'They code. You dream.'
}

const sampleAction: Card = {
  id: 'aa5',
  name: 'A/B Test',
  cost: 1,
  type: 'Action',
  text: 'Draw 2 cards. Discard 1.',
  effect: 'ab_test',
  keywords: ['Insight', 'Draw'],
  flavor: 'Iterate, then dominate.'
}

export const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0)

  const pages = [
    // Page 1: Welcome
    {
      title: 'Welcome to Dream Builders!',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '30px' }}>
            <img
              src="/dream_builders/assets/logo.png"
              alt="Dream Builders"
              style={{
                maxWidth: '300px',
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
          <p style={{ fontSize: FONT_SIZES.large, marginBottom: '20px' }}>
            Build your startup empire and reach $500,000 in revenue!
          </p>
          <p style={{ fontSize: FONT_SIZES.body, color: COLORS.textMuted }}>
            In this game, you'll play as an entrepreneur, using cards to build products,
            hire employees, and grow your business.
          </p>
        </div>
      ),
    },
    // Page 2: Turn Structure
    {
      title: 'Turn Structure',
      content: (
        <div>
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            marginBottom: '20px' 
          }}>
            <h3 style={{ color: COLORS.primary, marginBottom: '15px' }}>Each turn consists of:</h3>
            <ol style={{ textAlign: 'left', fontSize: FONT_SIZES.body, lineHeight: '1.8' }}>
              <li><strong>Start of Turn:</strong>
                <ul style={{ marginTop: '5px', marginBottom: '10px' }}>
                  <li>Products automatically sell inventory</li>
                  <li>Pay overhead costs</li>
                  <li>Gain capital (base + bonuses)</li>
                  <li>Draw 1 card</li>
                  <li>Hero power refreshes</li>
                </ul>
              </li>
              <li><strong>Main Phase:</strong>
                <ul style={{ marginTop: '5px', marginBottom: '10px' }}>
                  <li>Play cards from your hand</li>
                  <li>Use your hero power (once per turn)</li>
                  <li>Activate card abilities</li>
                </ul>
              </li>
              <li><strong>End Turn:</strong> Click the "End Turn" button when ready</li>
            </ol>
          </div>
          <p style={{ fontSize: FONT_SIZES.small, color: COLORS.textMuted, fontStyle: 'italic' }}>
            💡 Tip: Plan your moves carefully - capital doesn't carry over between turns!
          </p>
        </div>
      ),
    },
    // Page 3: Card Types
    {
      title: 'Card Types',
      content: (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Product Card */}
            <div style={{ textAlign: 'center' }}>
              <GameCard
                card={sampleProduct}
                displayMode="board"
                costInfo={{ originalCost: 1, discount: 0, finalCost: 1 }}
                isClickable={false}
                enableHover={true}
                hoverScale={1.1}
                hoverRaiseY={10}
                style={{ transform: 'scale(1.1)' }}
              />
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                <strong style={{ color: COLORS.success }}>Products</strong><br/>
                Generate revenue when sold<br/>
                Have inventory that depletes
              </p>
            </div>

            {/* Tool Card */}
            <div style={{ textAlign: 'center' }}>
              <GameCard
                card={sampleTool}
                displayMode="board"
                costInfo={{ originalCost: 2, discount: 0, finalCost: 2 }}
                isClickable={false}
                enableHover={true}
                hoverScale={1.1}
                hoverRaiseY={10}
                style={{ transform: 'scale(1.1)' }}
              />
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                <strong style={{ color: COLORS.primary }}>Tools</strong><br/>
                Provide ongoing benefits<br/>
                Stay in play permanently
              </p>
            </div>

            {/* Employee Card */}
            <div style={{ textAlign: 'center' }}>
              <GameCard
                card={sampleEmployee}
                displayMode="board"
                costInfo={{ originalCost: 3, discount: 0, finalCost: 3 }}
                isClickable={false}
                enableHover={true}
                hoverScale={1.1}
                hoverRaiseY={10}
                style={{ transform: 'scale(1.1)' }}
              />
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                <strong style={{ color: COLORS.warning }}>Employees</strong><br/>
                Enhance your business<br/>
                Provide passive bonuses
              </p>
            </div>

            {/* Action Card */}
            <div style={{ textAlign: 'center' }}>
              <GameCard
                card={sampleAction}
                displayMode="board"
                costInfo={{ originalCost: 1, discount: 0, finalCost: 1 }}
                isClickable={false}
                enableHover={true}
                hoverScale={1.1}
                hoverRaiseY={10}
                style={{ transform: 'scale(1.1)' }}
              />
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                <strong style={{ color: COLORS.danger }}>Actions</strong><br/>
                One-time effects<br/>
                Discarded after use
              </p>
            </div>
          </div>
        </div>
      ),
    },
    // Page 4: Resources
    {
      title: 'Resources & Economy',
      content: (
        <div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            {/* Capital */}
            <div style={{ 
              flex: 1,
              background: 'rgba(34, 197, 94, 0.1)', 
              padding: '20px', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>💰</div>
              <h3 style={{ color: COLORS.success, marginBottom: '10px' }}>Capital</h3>
              <p style={{ fontSize: FONT_SIZES.body }}>
                Used to play cards. Gain capital each turn and from card effects.
                Unspent capital doesn't carry over!
              </p>
            </div>

            {/* Revenue */}
            <div style={{ 
              flex: 1,
              background: 'rgba(251, 191, 36, 0.1)', 
              padding: '20px', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📈</div>
              <h3 style={{ color: COLORS.warning, marginBottom: '10px' }}>Revenue</h3>
              <p style={{ fontSize: FONT_SIZES.body }}>
                Your score! Reach $500,000 to win. Generated by selling products
                and card effects.
              </p>
            </div>
          </div>

          {/* Inventory */}
          <div style={{ 
            background: 'rgba(139, 92, 246, 0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
            <h3 style={{ color: COLORS.primary, marginBottom: '10px' }}>Inventory</h3>
            <p style={{ fontSize: FONT_SIZES.body }}>
              Products have inventory that depletes when sold. Add inventory with card effects
              to keep generating revenue!
            </p>
          </div>
        </div>
      ),
    },
    // Page 5: Key Mechanics
    {
      title: 'Key Game Mechanics',
      content: (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '15px',
            fontSize: FONT_SIZES.body
          }}>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong style={{ color: COLORS.primary }}>🔄 Recurring Effects:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Some Tools and Employees trigger at the start of each turn, providing ongoing value.
                Look for "Recurring:" in card text.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong style={{ color: COLORS.success }}>📊 Product Sales:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Products automatically sell 1 inventory at the start of each turn. 
                Some cards can trigger additional sales or add inventory.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(251, 191, 36, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong style={{ color: COLORS.warning }}>💸 Cost Discounts:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Various cards and hero powers can reduce card costs. Discounts are shown
                on cards in your hand and are temporary unless stated otherwise.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong style={{ color: COLORS.primary }}>🎯 Card Synergies:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Many cards work better together. For example, having multiple Products 
                makes some Tools more effective. Build combos for maximum profit!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    // Page 6: Hero Powers
    {
      title: 'Hero Powers',
      content: (
        <div>
          <p style={{ fontSize: FONT_SIZES.body, marginBottom: '20px', textAlign: 'center' }}>
            Each hero has a unique power that can be used once per turn:
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '15px',
            fontSize: FONT_SIZES.small
          }}>
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              padding: '15px', 
              borderRadius: '8px' 
            }}>
              <strong>Solo Hustler - Grind (1 💰):</strong> Draw 1 card. If it's a Product, reduce its cost by 1.
            </div>
            <div style={{ 
              background: 'rgba(107, 114, 128, 0.1)', 
              padding: '15px', 
              borderRadius: '8px' 
            }}>
              <strong>Brand Builder - Engage (2 💰):</strong> Add 2 inventory to a Product.
            </div>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '15px', 
              borderRadius: '8px' 
            }}>
              <strong>Automation Architect - Deploy Script (2 💰):</strong> Gain 1 recurring capital next turn.
            </div>
            <div style={{ 
              background: 'rgba(251, 191, 36, 0.1)', 
              padding: '15px', 
              borderRadius: '8px' 
            }}>
              <strong>Community Leader - Go Viral (1 💰):</strong> If you played 2+ cards, add inventory to a Product.
            </div>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              padding: '15px', 
              borderRadius: '8px' 
            }}>
              <strong>Serial Founder - Double Down (2 💰):</strong> Draw a card OR refresh a used Product.
            </div>
          </div>
        </div>
      ),
    },
    // Page 7: Tips
    {
      title: 'Pro Tips',
      content: (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '15px',
            fontSize: FONT_SIZES.body
          }}>
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong>💡 Manage Your Capital:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Capital doesn't carry over between turns. Try to spend it efficiently!
                Some cards give you extra capital to work with.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong>📦 Keep Inventory Stocked:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Products only generate revenue if they have inventory. Use cards and 
                hero powers to replenish inventory before it runs out!
              </p>
            </div>

            <div style={{ 
              background: 'rgba(251, 191, 36, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong>🔄 Build Your Engine:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Tools and Employees stay in play, creating an engine that generates 
                value each turn. Focus on building a sustainable business!
              </p>
            </div>

            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <strong>🎯 Use Your Hero Power:</strong>
              <p style={{ marginTop: '10px', fontSize: FONT_SIZES.small }}>
                Don't forget your hero power! It refreshes each turn and can provide 
                crucial advantages. Plan your turns around it.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const currentPageData = pages[currentPage]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 4000,
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
          borderRadius: '20px',
          padding: '40px',
          width: '75vw',
          height: '75vh',
          maxWidth: '1400px',
          maxHeight: '900px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(120, 80, 190, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          flexShrink: 0,
        }}>
          <h1 style={{ 
            fontSize: FONT_SIZES.title, 
            color: COLORS.warningLight,
            margin: 0
          }}>
            {currentPageData.title}
          </h1>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.textMuted,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = COLORS.white
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = COLORS.textMuted
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          marginBottom: '30px', 
          minHeight: '300px',
          flexGrow: 1,
          overflowY: 'auto',
          paddingRight: '10px',
        }}>
          {currentPageData.content}
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexShrink: 0,
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            style={{
              ...BUTTON_STYLES,
              background: currentPage === 0 ? '#4b5563' : 'linear-gradient(135deg, #7850be 0%, #5a3a9a 100%)',
              color: 'white',
              padding: '10px 20px',
              fontSize: FONT_SIZES.body,
              opacity: currentPage === 0 ? 0.5 : 1,
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {pages.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentPage ? COLORS.warningLight : COLORS.textMuted,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>

          {currentPage < pages.length - 1 ? (
            <button
              onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
              style={{
                ...BUTTON_STYLES,
                background: 'linear-gradient(135deg, #7850be 0%, #5a3a9a 100%)',
                color: 'white',
                padding: '10px 20px',
                fontSize: FONT_SIZES.body,
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                ...BUTTON_STYLES,
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                padding: '10px 20px',
                fontSize: FONT_SIZES.body,
              }}
            >
              Start Playing!
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 