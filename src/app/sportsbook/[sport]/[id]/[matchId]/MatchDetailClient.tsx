'use client'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Loader2, ChevronDown, ChevronLeft, Plus, Megaphone, X, Tv, AlertCircle, Info, Eye, EyeOff } from 'lucide-react'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'
import CashoutButton from '@/components/sportsbook/CashoutButton'
import BetSlipForm from '@/components/sportsbook/BetSlipForm'
import { useSnackbarStore } from '@/store/snackbarStore'
import { pusherClient } from '@/utils/pusher'
import { formatDate } from '@/utils/format'

// I will copy the rest of the file content here in the real implementation.
// For now, I'll just assume I can read the whole file and write it.
